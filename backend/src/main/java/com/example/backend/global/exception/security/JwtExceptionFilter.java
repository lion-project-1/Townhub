package com.example.backend.global.exception.security;

import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.security.cookie.RefreshTokenCookieManager;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {
    private final SecurityErrorResponseWriter errorResponseWriter;
    private final RefreshTokenCookieManager refreshTokenCookieManager;
    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (JwtSecurityException e) {
            if (response.isCommitted()) return;

            if (isLogout(request) && e.getErrorCode() == ErrorCode.TOKEN_EXPIRED) {
                ResponseCookie deleteCookie = refreshTokenCookieManager.delete();
                response.setHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

                errorResponseWriter.write(response, ErrorCode.LOGOUT_DONE);
                return;
            }
        } catch (ExpiredJwtException e) {
            errorResponseWriter.write(response, ErrorCode.TOKEN_EXPIRED);
            return;
        } catch (JwtException e) {
            errorResponseWriter.write(response, ErrorCode.TOKEN_INVALID);
            return;
        }

    }
        private boolean isLogout(HttpServletRequest request) {
            return "/api/users/logout".equals(request.getRequestURI());
        }
}


