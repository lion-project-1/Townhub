package com.example.backend.dto;


import com.example.backend.domain.User;
import lombok.Getter;

@Getter
public class SignupRequest {
    private String email;
    private String password;
    private String nickname;

    public User toEntity(String encodedPassword) {
        return User.builder()
                .email(this.email)
                .nickname(this.nickname)
                .password(encodedPassword)
                .build();
    }
}
