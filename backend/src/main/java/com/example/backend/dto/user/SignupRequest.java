package com.example.backend.dto.user;

import com.example.backend.domain.user.Role;
import com.example.backend.domain.user.User;
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
                .role(Role.COMMENTER)
                .build();
    }
}
