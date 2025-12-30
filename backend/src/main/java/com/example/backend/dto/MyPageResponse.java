package com.example.backend.dto;

import com.example.backend.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageResponse {
    private String email;
    private String nickname;
    private String profileImage;
    private String introduction;

    public static MyPageResponse from(Member member) {
        return new MyPageResponse(
                member.getEmail(),
                member.getNickname(),
                member.getProfileImage(),
                member.getIntroduction()
        );
    }
}
