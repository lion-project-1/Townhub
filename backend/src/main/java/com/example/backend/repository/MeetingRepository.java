package com.example.backend.repository;

import com.example.backend.domain.Meeting;
import com.example.backend.enums.MeetingMemberRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query(" select distinct m from Meeting m "
            + "join fetch m.host "
            + "join fetch m.location "
            + "left join fetch m.members mm "
            + "left join fetch mm.user "
            + "where m.id = :meetingId ")
    Optional<Meeting> findDetailWithMembersById(@Param("meetingId") Long meetingId);
}
