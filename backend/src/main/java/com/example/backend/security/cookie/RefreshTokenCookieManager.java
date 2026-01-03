package com.example.backend.security.cookie;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenCookieManager {
    private final boolean secure;
    private final String sameSite;
    private final long maxAgeSeconds;

    public RefreshTokenCookieManager(
            @Value("${cookie.refresh.secure:false}") boolean secure,
            @Value("${cookie.refresh.same-site:Lax}") String sameSite,
            @Value("${cookie.refresh.max-age-seconds:604800}") long maxAgeSeconds
    ) {
        this.secure = secure;
        this.sameSite = sameSite;
        this.maxAgeSeconds = maxAgeSeconds;
    }
//    dev/local: SameSite=Lax, secure=false
//    prod: SameSite=None, secure=true
    public ResponseCookie create(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAgeSeconds) // 7일
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie delete() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}