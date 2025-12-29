package com.example.backend.repository;

import com.example.backend.domain.MeetingJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingJoinRequestRepository extends JpaRepository<MeetingJoinRequest, Long> {
}
