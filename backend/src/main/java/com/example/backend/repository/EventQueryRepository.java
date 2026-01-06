package com.example.backend.repository;

import com.example.backend.dto.MyEventItemDto;
import com.example.backend.dto.UpcomingEventDto;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.backend.dto.EventCalendarResponse;
import com.example.backend.dto.EventCalendarSearchCondition;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;

public interface EventQueryRepository {
	Page<EventListResponse> findEventList(EventSearchCondition condition, Pageable pageable);

	Page<FlashEventListResponse> findFlashEventList(EventSearchCondition condition, Pageable pageable);

	List<EventCalendarResponse> findEventListForCalendar(EventCalendarSearchCondition condition);

	List<MyEventItemDto> findMyEvents(Long userId, Long cursor, int size);

	long countActiveEvents(Long townId);

	List<UpcomingEventDto> findUpcomingEvents(Long townId, int limit);

}