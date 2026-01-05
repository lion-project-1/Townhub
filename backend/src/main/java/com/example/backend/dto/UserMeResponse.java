package com.example.backend.dto;

import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMeResponse {
    private Long userId;
    private String email;
    private String nickname;
    private Long locationId;
    private String province;
    private String city;

    public static UserMeResponse from(User user) {
        Location location = user.getLocation();
        return UserMeResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .locationId(location != null ? location.getId(): null)
                .province(location != null ? location.getProvince() : null)
                .city(location != null ? location.getCity() : null)
                .build();
    }
}


