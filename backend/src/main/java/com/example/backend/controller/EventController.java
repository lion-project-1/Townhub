package com.example.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.EventCalendarResponse;
import com.example.backend.dto.EventCalendarSearchCondition;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;

	@GetMapping
	public ResponseEntity<ApiResponse<Page<EventListResponse>>> getEventList(
		EventSearchCondition condition,
		@PageableDefault(page = 0, size = 6) Pageable pageable) {

		Page<EventListResponse> eventList
			= eventService.getEventList(condition, pageable);

		return ResponseEntity.ok(ApiResponse.success(eventList));
	}

	@GetMapping("/flash")
	public ResponseEntity<ApiResponse<Page<FlashEventListResponse>>> getFlashEventList(
		EventSearchCondition condition,
		@PageableDefault(page = 0, size = 3) Pageable pageable) {

		Page<FlashEventListResponse> eventList
			= eventService.getFlashEventList(condition, pageable);

		return ResponseEntity.ok(ApiResponse.success(eventList));
	}

	@GetMapping("/calendar")
	public ResponseEntity<ApiResponse<List<EventCalendarResponse>>> getEventCalendar(
		EventCalendarSearchCondition condition
	) {
		List<EventCalendarResponse> events = eventService.getCalendarEvents(condition);
		return ResponseEntity.ok(ApiResponse.success(events));
	}
}