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
import com.example.backend.dto.EventJoinRequestDto;
import com.example.backend.dto.EventJoinRequestResponse;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.EventUpdateRequest;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.enums.EventStatus;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.EventManageService;
import com.example.backend.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;
	private final EventManageService eventManageService;

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
		return ResponseEntity.ok(ApiResponse.success("이벤트가 변경되었습니다.", null));
	}

	@DeleteMapping("/{eventId}")
	public ResponseEntity<ApiResponse<Void>> cancelEvent(
		@AuthenticationPrincipal User user,
		@PathVariable("eventId") Long eventId
	) {
		eventService.cancelEvent(eventId, user.getId());
		return ResponseEntity.ok(ApiResponse.success("이벤트가 취소되었습니다."));
	}

	// 참여 신청 (login)
	@PostMapping("/{eventId}/join-requests")
	public ResponseEntity<ApiResponse<Void>> requestJoin(
		@AuthenticationPrincipal User user,
		@PathVariable Long eventId,
		@RequestBody @Valid EventJoinRequestDto request) {

		eventService.requestJoin(user.getId(), eventId, request);

		return ResponseEntity.ok(ApiResponse.success("이벤트 참여 신청이 완료되었습니다."));
	}

	// 참여 신청 취소 (login)
	@DeleteMapping("/join-requests/{requestId}")
	public ResponseEntity<ApiResponse<Void>> cancelJoinRequest(
		@AuthenticationPrincipal User user,
		@PathVariable Long requestId
	) {
		eventService.cancelJoinRequest(user.getId(), requestId);
		return ResponseEntity.ok(ApiResponse.success("이벤트 신청이 취소되었습니다."));
	}

	// 목록 조회 (host)
	@GetMapping("/{eventId}/manage/join-requests")
	public ApiResponse<List<EventJoinRequestResponse>> getJoinRequests(
		@PathVariable Long eventId,
		@AuthenticationPrincipal User user) {

		List<EventJoinRequestResponse> joinRequests = eventManageService.getJoinRequests(eventId, user.getId());
		return ApiResponse.success(joinRequests);
	}

	// 수락 (host)
	@PostMapping("/{eventId}/manage/join-requests/{requestId}/approve")
	public ApiResponse<Void> approve(
		@PathVariable Long eventId,
		@PathVariable Long requestId,
		@AuthenticationPrincipal User user) {
		eventManageService.approveJoinRequest(eventId, requestId, user.getId());
		return ApiResponse.success();
	}

	// 거절 (host)
	@PostMapping("/{eventId}/manage/join-requests/{requestId}/reject")
	public ApiResponse<Void> reject(
		@PathVariable Long eventId,
		@PathVariable Long requestId,
		@AuthenticationPrincipal User user) {
		eventManageService.rejectJoinRequest(eventId, requestId, user.getId());
		return ApiResponse.success();
	}
}