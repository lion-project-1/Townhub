package com.example.backend.dto;

import com.example.backend.enums.ParticipantRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MeetingMemberResponse {

	private Long userId;
	private String nickname;
	private ParticipantRole role;
}