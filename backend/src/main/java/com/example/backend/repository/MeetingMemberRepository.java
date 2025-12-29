package com.example.backend.repository;

import com.example.backend.domain.MeetingMember;
import com.example.backend.enums.MeetingMemberRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingMemberRepository extends JpaRepository<MeetingMember, Long> {
    boolean existsByMeetingIdAndUserIdAndRole(
            Long meetingId,
            Long userId,
            MeetingMemberRole role
    );
}
