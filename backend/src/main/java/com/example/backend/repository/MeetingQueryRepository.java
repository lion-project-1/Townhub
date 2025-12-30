package com.example.backend.repository;

import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MeetingQueryRepository {

    Page<MeetingListResponse> findMeetingList( MeetingSearchCondition condition, Pageable pageable);
}
