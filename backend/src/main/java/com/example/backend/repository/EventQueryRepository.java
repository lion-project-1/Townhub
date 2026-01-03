package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;

public interface EventQueryRepository {
	Page<EventListResponse> findEventList(EventSearchCondition condition, Pageable pageable);

	Page<FlashEventListResponse> findFlashEventList(EventSearchCondition condition, Pageable pageable);
}
