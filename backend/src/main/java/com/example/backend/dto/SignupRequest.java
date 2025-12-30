package com.example.backend.dto;


import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import lombok.Getter;

@Getter
public class SignupRequest {
    private String email;
    private String password;
    private String nickname;
    private String province;
    private String city;
//    private String town;

    public User toEntity(String encodedPassword, Location location) {
        return User.builder()
                .email(this.email)
                .nickname(this.nickname)
                .password(encodedPassword)
                .location(location)
                .build();
    }
}
