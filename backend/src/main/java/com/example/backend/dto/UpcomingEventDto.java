package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpcomingEventDto {

    private Long id;
    private String title;
    private LocalDateTime startAt;
    private Integer members;
    private Integer capacity;
}