package com.example.backend.repository;

import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingSearchCondition;
import com.example.backend.dto.MyMeetingItemDto;
import com.example.backend.dto.PopularMeetingDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MeetingQueryRepository {

    Page<MeetingListResponse> findMeetingList( MeetingSearchCondition condition, Pageable pageable);
    List<MyMeetingItemDto> findMyMeetings(Long userId, Long cursor, int size);

    long countActiveMeetings(Long townId);

    List<PopularMeetingDto> findPopularMeetings(Long townId, int limit);
}
