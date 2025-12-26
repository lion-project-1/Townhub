package com.example.backend.dto.user;

import com.example.backend.domain.user.User;
import lombok.Getter;

@Getter
public class SignupResponse {
    private final Long id;
    private final String email;
    private final String nickname;

    private SignupResponse(Long id, String email, String nickname) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
    }

    public static SignupResponse from(User user) {
        return new SignupResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname()
        );
    }
}
