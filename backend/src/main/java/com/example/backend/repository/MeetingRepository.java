package com.example.backend.repository;

import com.example.backend.domain.Meeting;
import com.example.backend.enums.MeetingMemberRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

}
