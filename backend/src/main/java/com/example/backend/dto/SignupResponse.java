package com.example.backend.dto;

import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import lombok.Getter;

@Getter
public class SignupResponse {
    private final Long id;
    private final String email;
    private final String nickname;
    private final String location;

    private SignupResponse(Long id, String email, String nickname, String location) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.location = location;
    }

    public static SignupResponse from(User user) {
        return new SignupResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                formatLocation(user.getLocation())
        );
    }

    private static String formatLocation(Location location) {
        if (location == null) return null;
        String province = safe(location.getProvince());
        String city = safe(location.getCity());
        String town = safe(location.getTown());
        String result = String.join(
                " ", province, city, town)
                .trim()
                .replaceAll("\\s+", " ");
        return result.isBlank() ? null : result;
    }

    private static String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
