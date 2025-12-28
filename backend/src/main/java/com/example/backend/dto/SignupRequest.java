package com.example.backend.dto;


import com.example.backend.domain.User;
import com.example.backend.enums.UserRole;
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
                .role(UserRole.COMMENTER)
                .build();
    }
}
