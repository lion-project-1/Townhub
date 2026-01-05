package com.example.backend.dto;

import com.example.backend.enums.ParticipantRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventMemberResponse {
	private Long userId;
	private String nickname;
	private ParticipantRole role; // enum name: MEMBER (원하면 HOST도 가능)
}
