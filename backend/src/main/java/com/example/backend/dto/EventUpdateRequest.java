package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.enums.EventCategory;

import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventUpdateRequest {
	private String title;
	private String description;
	private EventCategory category;
	private Long locationId;
	private String eventPlace;
	@Future(message = "이벤트 시작 시간은 미래여야 합니다.")
	private LocalDateTime startAt;
	private Integer capacity;
}
