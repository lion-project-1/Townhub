package com.example.backend.repository;

import com.example.backend.domain.Meeting;
import com.example.backend.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Event;

public interface EventRepository extends JpaRepository<Event, Long>, EventQueryRepository {

    List<Event> findEventByHost(User user);

}