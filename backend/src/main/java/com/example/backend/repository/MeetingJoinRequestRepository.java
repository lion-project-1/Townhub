package com.example.backend.repository;

import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingJoinRequest;
import com.example.backend.domain.User;
import com.example.backend.enums.JoinRequestStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingJoinRequestRepository extends JpaRepository<MeetingJoinRequest, Long> {

    boolean existsByMeetingAndUser(Meeting meeting, User user);

    List<MeetingJoinRequest> findByMeetingAndStatus(Meeting meeting, JoinRequestStatus status);

    Optional<MeetingJoinRequest> findByIdAndMeeting(Long id, Meeting meeting);

}
