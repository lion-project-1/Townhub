package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class EventListResponse {
	private Long eventId;
	private String title;
	private String description;

	private EventCategory category;
	private EventStatus status;
	private String eventPlace;

	private LocalDateTime startAt;
	private LocalDateTime createdAt;

	private String province;
	private String city;

	private int capacity;
	private long memberCount;
}
