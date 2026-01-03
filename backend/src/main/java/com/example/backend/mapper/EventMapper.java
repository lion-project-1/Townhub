package com.example.backend.mapper;

import java.time.LocalDateTime;
import java.util.List;

import com.example.backend.domain.Event;
import com.example.backend.domain.EventMember;
import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import com.example.backend.dto.EventDetailResponse;
import com.example.backend.dto.EventMemberResponse;

public class EventMapper {

	public static EventDetailResponse toEventDetailResponse(
		Event event,
		List<EventMemberResponse> members,
		long memberCount,
		boolean isEnded
	) {
		Location location = event.getLocation();
		User host = event.getHost();

		return EventDetailResponse.builder()
			.eventId(event.getId())
			.title(event.getTitle())
			.description(event.getDescription())
			.category(event.getCategory())
			.status(event.getStatus())
			.eventPlace(event.getEventPlace())
			.startAt(event.getStartAt())
			.createdAt(event.getCreatedAt())
			.capacity(event.getCapacity())
			.memberCount(memberCount)
			.province(location.getProvince())
			.city(location.getCity())
			.hostUserId(host.getId())
			.hostNickname(host.getNickname())
			.isEnded(isEnded)
			.members(members)
			.build();
	}

	public static EventMemberResponse toEventMemberResponse(EventMember member) {
		return EventMemberResponse.builder()
			.userId(member.getUser().getId())
			.nickname(member.getUser().getNickname())
			.role(member.getRole())
			.build();
	}

	// public static Event toEvent(EventCreateRequest request, Location location, User host) {
	// 	return Event.builder()
	// 		.title(request.getTitle())
	// 		.description(request.getDescription())
	// 		.category(request.getCategory())
	// 		.eventPlace(request.getEventPlace())
	// 		.startAt(request.getStartAt())
	// 		.capacity(request.getCapacity())
	// 		.status(EventStatus.RECRUITING)
	// 		.host(host)
	// 		.location(location)
	// 		.build();
	// }

	public static boolean calculateIsEnded(LocalDateTime startAt) {
		if (startAt == null)
			return false;
		return !LocalDateTime.now().isBefore(startAt); // now >= startAt
	}
}
