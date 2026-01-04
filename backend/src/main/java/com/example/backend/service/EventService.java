package com.example.backend.service;

import static com.example.backend.mapper.EventMapper.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.domain.Event;
import com.example.backend.domain.EventJoinRequest;
import com.example.backend.domain.EventMember;
import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import com.example.backend.dto.EventCalendarResponse;
import com.example.backend.dto.EventCalendarSearchCondition;
import com.example.backend.dto.EventCreateRequest;
import com.example.backend.dto.EventDetailResponse;
import com.example.backend.dto.EventJoinRequestDto;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventMemberResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.EventUpdateRequest;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;
import com.example.backend.enums.JoinRequestStatus;
import com.example.backend.enums.ParticipantRole;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.mapper.EventMapper;
import com.example.backend.repository.EventJoinRequestRepository;
import com.example.backend.repository.EventMemberRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

	private final EventRepository eventRepository;
	private final EventMemberRepository eventMemberRepository;
	private final UserRepository userRepository;
	private final LocationRepository locationRepository;
	private final EventJoinRequestRepository eventJoinRequestRepository;

	public Page<EventListResponse> getEventList(EventSearchCondition condition, Pageable pageable) {
		return eventRepository.findEventList(condition, pageable);
	}

	public Page<FlashEventListResponse> getFlashEventList(EventSearchCondition condition, Pageable pageable) {
		return eventRepository.findFlashEventList(condition, pageable);
	}

	public List<EventCalendarResponse> getCalendarEvents(EventCalendarSearchCondition condition) {
		if (condition.getFrom().isAfter(condition.getTo())) {
			throw new CustomException(ErrorCode.INVALID_DATE_RANGE);
		}
		return eventRepository.findEventListForCalendar(condition);
	}

	public EventDetailResponse getEventDetail(Long eventId) {
		Event event = getEvent(eventId);

		// 참여자(MEMBER)만 응답
		List<EventMemberResponse> members = event.getMembers().stream()
			.filter(m -> m.getRole() == ParticipantRole.MEMBER)
			.map(EventMapper::toEventMemberResponse)
			.toList();

		long memberCount = event.getMembers().stream()
			.filter(m -> m.getRole() == ParticipantRole.MEMBER)
			.count();

		boolean isEnded = calculateIsEnded(event.getStartAt());

		return toEventDetailResponse(event, members, memberCount, isEnded);
	}

	@Transactional
	public Long createEvent(Long userId, EventCreateRequest request) {
		User host = getUser(userId);

		validateFlashStartAt(request.getCategory(), request.getStartAt());

		Location location = locationRepository.findById(request.getLocationId())
			.orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

		Event event = toEvent(request, location, host);
		eventRepository.save(event);

		EventMember hostMember = EventMember.createHost(event, host);
		eventMemberRepository.save(hostMember);

		return event.getId();
	}

	@Transactional
	public void updateEvent(
		Long eventId,
		Long userId,
		EventUpdateRequest request
	) {
		Event event = getEvent(eventId);

		validateHost(eventId, userId);

		Location location = null;
		if (request.getLocationId() != null) {
			location = locationRepository.findById(request.getLocationId())
				.orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));
		}

		event.update(
			request.getTitle(),
			request.getDescription(),
			request.getCategory(),
			location,                 // 변경 없으면 null 전달
			request.getEventPlace(),
			request.getStartAt(),
			request.getCapacity()
		);
	}

	@Transactional
	public void cancelEvent(Long eventId, Long userId) {
		Event event = getEvent(eventId);
		validateHost(eventId, userId);
		event.cancel();
	}

	@Transactional
	public void requestJoin(Long userId, Long eventId, EventJoinRequestDto dto) {
		User user = getUser(userId);
		Event event = getEvent(eventId);

		// 종료 및 취소 이벤트 신청 불가
		if (event.getStatus().equals(EventStatus.CANCELED) || event.getStatus().equals(EventStatus.CLOSED)) {
			throw new CustomException(ErrorCode.EVENT_NOT_OPEN);
		}

		// 정원 초과 신청 불가
		if (eventMemberRepository.countByEvent(event) >= event.getCapacity()) {
			throw new CustomException(ErrorCode.EVENT_IS_FULL);
		}

		// 중복 신청 불가
		if (eventJoinRequestRepository.existsByEventAndUser(event, user)) {
			throw new CustomException(ErrorCode.ALREADY_EVENT_REQUESTED);
		}

		EventJoinRequest joinRequest = EventJoinRequest.builder()
			.user(user)
			.event(event)
			.status(JoinRequestStatus.PENDING)
			.message(dto.getMessage())
			.build();

		eventJoinRequestRepository.save(joinRequest);
	}

	@Transactional
	public void cancelJoinRequest(Long userId, Long requestId) {
		// 신청 내역 없으면 취소 불가
		EventJoinRequest request = eventJoinRequestRepository.findById(requestId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_JOIN_REQUEST_NOT_FOUND));

		// 본인 아니면 취소 불가
		if (!request.getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.EVENT_JOIN_REQUEST_FORBIDDEN);
		}

		// 대기 상태 아니면 취소 불가
		if (!request.getStatus().equals(JoinRequestStatus.PENDING)) {
			throw new CustomException(ErrorCode.EVENT_JOIN_REQUEST_NOT_PENDING);
		}

		eventJoinRequestRepository.delete(request);
	}

	private Event getEvent(Long eventId) {
		return eventRepository.findById(eventId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
	}

	private User getUser(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}

	private void validateHost(Long eventId, Long userId) {
		if (!eventMemberRepository.existsByEventIdAndUserIdAndRole(
			eventId, userId, ParticipantRole.HOST)) {
			throw new CustomException(ErrorCode.EVENT_HOST_ONLY);
		}
	}

	private void validateFlashStartAt(EventCategory category, LocalDateTime startAt) {
		if (category != EventCategory.FLASH || startAt == null)
			return;

		ZoneId KST = ZoneId.of("Asia/Seoul");
		LocalDate today = LocalDate.now(KST);
		LocalDate startDate = startAt.atZone(KST).toLocalDate();

		if (!startDate.equals(today)) {
			throw new CustomException(ErrorCode.INVALID_FLASH_START_AT); // "번개 이벤트는 당일만 생성 가능합니다."
		}
	}
}