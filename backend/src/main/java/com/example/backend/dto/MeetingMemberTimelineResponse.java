package com.example.backend.dto;

import com.example.backend.enums.MeetingMemberRole;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MeetingMemberTimelineResponse {

    private Long userId;
    private String nickname;
    private MeetingMemberRole role;
    private LocalDateTime joinedAt;
}