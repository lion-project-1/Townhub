package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.domain.Event;
import com.example.backend.domain.EventJoinRequest;
import com.example.backend.domain.EventMember;
import com.example.backend.dto.EventJoinRequestResponse;
import com.example.backend.dto.EventManageMemberResponse;
import com.example.backend.enums.JoinRequestStatus;
import com.example.backend.enums.ParticipantRole;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.EventJoinRequestRepository;
import com.example.backend.repository.EventMemberRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventManageService {

	private final EventRepository eventRepository;
	private final EventMemberRepository eventMemberRepository;
	private final UserRepository userRepository;
	private final LocationRepository locationRepository;
	private final EventJoinRequestRepository eventJoinRequestRepository;

	public List<EventJoinRequestResponse> getJoinRequests(Long eventId, Long userId) {
		Event event = getEvent(eventId);
		validateHost(eventId, userId);

		return eventJoinRequestRepository
			.findByEventAndStatusOrderByCreatedAtDesc(event, JoinRequestStatus.PENDING)
			.stream()
			.map(req -> new EventJoinRequestResponse(
				req.getId(),
				req.getUser().getId(),
				req.getUser().getNickname(),
				req.getMessage(),
				req.getCreatedAt()
			))
			.toList();
	}

	@Transactional
	public void approveJoinRequest(Long eventId, Long requestId, Long hostUserId) {
		validateHost(eventId, hostUserId);

		EventJoinRequest request = eventJoinRequestRepository
			.findByIdAndEventId(requestId, eventId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_JOIN_REQUEST_NOT_FOUND));

		checkStatus(request);

		Event event = getEvent(eventId);
		checkCapacity(getEvent(eventId));

		request.approve();
		eventMemberRepository.save(EventMember.createMember(event, request.getUser()));
	}

	@Transactional
	public void rejectJoinRequest(Long eventId, Long requestId, Long hostUserId) {
		validateHost(eventId, hostUserId);

		EventJoinRequest request = eventJoinRequestRepository
			.findByIdAndEventId(requestId, eventId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_JOIN_REQUEST_NOT_FOUND));

		checkStatus(request);

		request.reject();
	}

	public List<EventManageMemberResponse> getMembers(Long eventId, Long userId) {
		Event event = getEvent(eventId);
		validateHost(eventId, userId);
		List<EventMember> members = eventMemberRepository.findAllByEvent(event);
		return members.stream()
			.map(member -> EventManageMemberResponse.builder()
				.eventMemberId(member.getId())
				.nickname(member.getUser().getNickname()) // 또는 getName()
				.role(member.getRole())
				.joinedAt(member.getCreatedAt())
				.build()
			)
			.toList();
	}

	@Transactional
	public void removeMember(Long eventId, Long memberId, Long hostUserId) {

		Event event = getEvent(eventId);

		validateHost(eventId, hostUserId);

		EventMember member = eventMemberRepository
			.findByIdAndEvent(memberId, event)
			.orElseThrow(() ->
				new CustomException(ErrorCode.EVENT_MEMBER_NOT_FOUND));

		if (member.getRole() == ParticipantRole.HOST) {
			throw new CustomException(ErrorCode.EVENT_HOST_CANNOT_BE_REMOVED);
		}

		eventMemberRepository.delete(member);
	}

	private void checkStatus(EventJoinRequest request) {
		if (request.getStatus() != JoinRequestStatus.PENDING) {
			throw new CustomException(ErrorCode.EVENT_JOIN_REQUEST_NOT_PENDING);
		}
	}

	private Event getEvent(Long eventId) {
		return eventRepository.findById(eventId)
			.orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
	}

	private void validateHost(Long eventId, Long userId) {
		if (!eventMemberRepository.existsByEventIdAndUserIdAndRole(
			eventId, userId, ParticipantRole.HOST)) {
			throw new CustomException(ErrorCode.EVENT_HOST_ONLY);
		}
	}

	private void checkCapacity(Event event) {
		if (eventMemberRepository.countByEvent(event) >= event.getCapacity()) {
			throw new CustomException(ErrorCode.EVENT_IS_FULL);
		}
	}
}
