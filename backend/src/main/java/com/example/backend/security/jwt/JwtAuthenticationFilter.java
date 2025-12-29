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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
        String token = getToken(request);

        if (StringUtils.hasText(token)) {
            try {
                Authentication authentication = getAuthentication(token);
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

    private String getToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        // 헤더로 AccessToken 들어올 때
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        // 쿠키로 AccessToken 들어왔을 때
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    // 파싱
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtProvider.getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 검증
    private Authentication getAuthentication(String token) {
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
