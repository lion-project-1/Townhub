package com.example.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

	private final EventRepository eventRepository;

	public Page<EventListResponse> getEventList(EventSearchCondition condition, Pageable pageable) {
		return eventRepository.findEventList(condition, pageable);
	}

	public Page<FlashEventListResponse> getFlashEventList(EventSearchCondition condition, Pageable pageable) {
		return eventRepository.findFlashEventList(condition, pageable);
	}
}
