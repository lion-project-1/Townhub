package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingMember;
import com.example.backend.domain.User;
import java.util.List;
import java.util.Optional;
import com.example.backend.enums.ParticipantRole;

public interface MeetingMemberRepository extends JpaRepository<MeetingMember, Long> {
	boolean existsByMeetingIdAndUserIdAndRole(
		Long meetingId,
		Long userId,
		ParticipantRole role
	);

    boolean existsByMeetingAndUser(Meeting meeting, User user);

    long countByMeeting(Meeting meeting);

    List<MeetingMember> findAllByMeeting(Meeting meeting);

    Optional<MeetingMember> findByIdAndMeeting(Long id, Meeting meeting);

}
