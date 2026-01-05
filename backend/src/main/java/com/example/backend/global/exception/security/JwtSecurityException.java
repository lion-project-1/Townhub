package com.example.backend.global.exception.security;

import com.example.backend.global.exception.custom.ErrorCode;
import lombok.Getter;

@Getter
public class JwtSecurityException extends RuntimeException {

    private final ErrorCode errorCode;

    public JwtSecurityException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}


