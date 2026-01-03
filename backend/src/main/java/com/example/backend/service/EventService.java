package com.example.backend.service;

import static com.example.backend.mapper.EventMapper.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.domain.Event;
import com.example.backend.domain.User;
import com.example.backend.dto.EventCalendarResponse;
import com.example.backend.dto.EventCalendarSearchCondition;
import com.example.backend.dto.EventDetailResponse;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventMemberResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.enums.ParticipantRole;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.mapper.EventMapper;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

	private final EventRepository eventRepository;
	private final UserRepository userRepository;

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

	private Event getEvent(Long eventId) {
		return eventRepository.findById(eventId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
	}

	private User getUser(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}
}