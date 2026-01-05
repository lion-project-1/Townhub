package com.example.backend.dto;

import com.example.backend.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EventCreateResponse {
	private Long eventId;
	private EventStatus status;
}
