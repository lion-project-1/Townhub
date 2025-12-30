package com.example.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginResponse {
    private final Long userId;
    private final String email;
    private final String nickname;
    private final String accessToken;
    private final String refreshToken;

    @Builder
    private LoginResponse(
            Long userId,
            String email,
            String nickname,
            String accessToken,
            String refreshToken
    ) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}