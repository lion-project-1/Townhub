package com.example.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenReissueResult {

    private final String accessToken;
    private final String refreshToken;
}