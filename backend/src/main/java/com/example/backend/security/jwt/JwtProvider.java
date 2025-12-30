package com.example.backend.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expire-time}")
    private long accessExpire;

    @Value("${jwt.refresh-token-expire-time}")
    private long refreshExpire;

    private Key key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(Long userId, String email) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) //
                .claim("email", email) // 토큰 해석 (이메일 씀)
                .setIssuedAt(new Date()) // 발급 시점
                .setExpiration(new Date(System.currentTimeMillis() + accessExpire)) // 만료 시점
                .signWith(key, SignatureAlgorithm.HS256) // 서버만 알고 있는 key 로 위조방지
                .compact();
    }

    public String createRefreshToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpire))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}