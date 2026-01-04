package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Event;
import com.example.backend.domain.EventJoinRequest;
import com.example.backend.domain.User;
import com.example.backend.enums.JoinRequestStatus;

public interface EventJoinRequestRepository extends JpaRepository<EventJoinRequest, Long> {
	boolean existsByEventAndUser(Event event, User user);

	List<EventJoinRequest> findByEventAndStatusOrderByCreatedAtDesc(Event event, JoinRequestStatus status);

	Optional<EventJoinRequest> findByIdAndEventId(Long id, Long eventId);

	Optional<EventJoinRequest> findByEvent_IdAndUser_Id(Long eventId, Long userId);

	Optional<EventJoinRequest> findByEventAndUser(Event event, User user);
}
