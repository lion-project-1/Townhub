package com.example.backend.global.exception.security;

import com.example.backend.global.exception.custom.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {
    private final SecurityErrorResponseWriter errorResponseWriter;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (JwtSecurityException e) {
            errorResponseWriter.write(response, e.getErrorCode());
        } catch (ExpiredJwtException e) {
            errorResponseWriter.write(response, ErrorCode.TOKEN_EXPIRED);
        } catch (JwtException e) {
            errorResponseWriter.write(response, ErrorCode.TOKEN_INVALID);
        }
    }
}


