package com.example.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TownStatsDto {

    private long activeMeetings;
    private long upcomingEvents;
    private long totalQuestions;
    private long activeUsers;
}