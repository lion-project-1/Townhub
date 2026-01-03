package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.EventMember;
import com.example.backend.enums.ParticipantRole;

public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
	boolean existsByEventIdAndUserIdAndRole(
		Long eventId,
		Long userId,
		ParticipantRole role
	);
}
