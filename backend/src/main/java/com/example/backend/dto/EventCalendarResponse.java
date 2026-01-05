package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EventCalendarResponse {
	private Long id;
	private String title;
	private LocalDateTime startAt;
	private EventStatus status;
}