package com.example.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.domain.User;
import com.example.backend.dto.EventCalendarResponse;
import com.example.backend.dto.EventCalendarSearchCondition;
import com.example.backend.dto.EventCreateRequest;
import com.example.backend.dto.EventCreateResponse;
import com.example.backend.dto.EventDetailResponse;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.EventUpdateRequest;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.enums.EventStatus;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.EventService;

import jakarta.validation.Valid;
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

	@GetMapping("/{eventId}")
	public ResponseEntity<ApiResponse<EventDetailResponse>> getEventDetail(
		@PathVariable Long eventId
	) {
		EventDetailResponse response = eventService.getEventDetail(eventId);
		return ResponseEntity.ok(ApiResponse.success(response));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<EventCreateResponse>> createEvent(
		@AuthenticationPrincipal User user,
		@RequestBody @Valid EventCreateRequest request) {

		Long eventId = eventService.createEvent(user.getId(), request);

		EventCreateResponse response =
			new EventCreateResponse(eventId, EventStatus.RECRUITING);

		// 추후에 메시지를 상수/enum 변경 고려
		return ResponseEntity.ok(ApiResponse.success("이벤트가 생성되었습니다.", response));
	}

	@PatchMapping("/{eventId}")
	public ResponseEntity<ApiResponse<Void>> updateEvent(
		@PathVariable Long eventId,
		@AuthenticationPrincipal User user,
		@RequestBody EventUpdateRequest request) {

		eventService.updateEvent(
			eventId,
			user.getId(),
			request
		);

		return ResponseEntity.ok(ApiResponse.success("모임이 변경되었습니다.", null));
	}

	@DeleteMapping("/{eventId}")
	public ResponseEntity<ApiResponse<Void>> cancelEvent(
		@AuthenticationPrincipal User user,
		@PathVariable("eventId") Long eventId
	) {
		eventService.cancelEvent(eventId, user.getId());
		return ResponseEntity.ok(ApiResponse.success("이벤트가 취소되었습니다."));
	}

}