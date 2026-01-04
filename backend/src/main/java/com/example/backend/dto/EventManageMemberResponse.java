package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.enums.ParticipantRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventManageMemberResponse {
	private Long eventMemberId;
	private String nickname;
	private ParticipantRole role; // enum name: MEMBER (원하면 HOST도 가능)
	private LocalDateTime joinedAt;
}
