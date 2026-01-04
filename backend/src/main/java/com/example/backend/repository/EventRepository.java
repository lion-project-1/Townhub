package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Event;

public interface EventRepository extends JpaRepository<Event, Long>, EventQueryRepository {
}
