package com.example.backend.security.jwt;

import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expire-time}")
    private long accessExpire;

    @Value("${jwt.refresh-token-expire-time}")
    private long refreshExpire;

    @Value("${jwt.master-token}")
    private String masterToken;

    @Value("${jwt.master-user-id}")
    private String masterUserId;

    public String createAccessToken(Long userId, String email) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) //
                .claim("email", email) // 토큰 해석 (이메일 씀)
                .setIssuedAt(new Date()) // 발급 시점
                .setExpiration(new Date(System.currentTimeMillis() + accessExpire)) // 만료 시점
                .signWith(getKey()) // 서버만 알고 있는 key 로 위조방지
                .compact();
    }

    public String createRefreshToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpire))
                .signWith(getKey())
                .compact();
    }

    public LocalDateTime getRefreshTokenExpiredAt() {
        return LocalDateTime.now().plusSeconds(refreshExpire / 1000);
    }

    public boolean isMasterToken(String token) {
        return StringUtils.hasText(masterToken) && masterToken.equals(token);
    }

    public Long getMasterUserIdOrThrow() {
        if (!StringUtils.hasText(masterUserId)) {
            throw new CustomException(ErrorCode.MASTER_USER_ID_NOT_FOUND);
        }
        return Long.parseLong(masterUserId);
    }

    protected Key getKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
}