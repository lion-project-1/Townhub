package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Event;
import com.example.backend.domain.EventMember;
import com.example.backend.enums.ParticipantRole;

public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
	boolean existsByEventIdAndUserIdAndRole(
		Long eventId,
		Long userId,
		ParticipantRole role
	);

	long countByEvent(Event event);

	List<EventMember> findAllByEvent(Event event);

	Optional<EventMember> findByIdAndEvent(Long id, Event event);
}
