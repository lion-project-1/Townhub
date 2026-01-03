package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventDetailResponse {

	private Long eventId;
	private String title;
	private String description;

	private EventCategory category; // enum name
	private EventStatus status;   // enum name

	private String eventPlace;
	private LocalDateTime startAt;
	private LocalDateTime createdAt;

	private Integer capacity;
	private Long memberCount; // role=MEMBER count

	private String province;
	private String city;

	private Long hostUserId;
	private String hostNickname;

	private boolean isEnded;

	private List<EventMemberResponse> members;
}
