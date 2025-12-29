package com.example.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class TokenReissueResponse {

    private final String accessToken;

    @Builder
    private TokenReissueResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}