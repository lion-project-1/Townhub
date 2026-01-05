package com.example.backend.security.jwt;

import com.example.backend.domain.User;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.global.exception.security.JwtSecurityException;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = resolveAccessToken(request);

        if (StringUtils.hasText(token)) {
            try {
                Authentication authentication = authenticate(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (ExpiredJwtException e) {
                SecurityContextHolder.clearContext();
                throw new JwtSecurityException(ErrorCode.TOKEN_EXPIRED);
            } catch (JwtException e) {
                SecurityContextHolder.clearContext();
                throw new JwtSecurityException(ErrorCode.TOKEN_INVALID);
            } catch (IllegalArgumentException e) {
                SecurityContextHolder.clearContext();
                throw new JwtSecurityException(ErrorCode.TOKEN_NOT_FOUND);
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw new JwtSecurityException(ErrorCode.TOKEN_INTERNAL);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveAccessToken(HttpServletRequest request) {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        // 헤더로 AccessToken 들어올 때
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        return null;
    }

    // 파싱
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtProvider.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 검증
    private Authentication authenticate(String token) {
        // 만료 없는 토큰 (환경변수로 설정한 userId 값으로 인증)
        if (jwtProvider.isMasterToken(token)) {
            Long masterUserId = jwtProvider.getMasterUserIdOrThrow();
            User masterUser = userRepository.findById(masterUserId)
                    .orElseThrow(() -> new JwtSecurityException(ErrorCode.USER_NOT_FOUND));

            return new UsernamePasswordAuthenticationToken(
                    masterUser, null, Collections.emptyList()
            );
        }

        Claims claims = parseClaims(token);

        Long userId = Long.parseLong(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new JwtSecurityException(ErrorCode.USER_NOT_FOUND));

        // 인증 객체 생성
        return new UsernamePasswordAuthenticationToken(
                user, null, Collections.emptyList()
        );
    }
}
