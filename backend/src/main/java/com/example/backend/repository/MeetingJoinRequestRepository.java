package com.example.backend.repository;

import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingJoinRequest;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingJoinRequestRepository extends JpaRepository<MeetingJoinRequest, Long> {

    boolean existsByMeetingAndUser(Meeting meeting, User user);

}
