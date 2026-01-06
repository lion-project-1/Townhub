package com.example.backend.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TownDashboardResponse {

    private TownStatsDto stats;
    private List<PopularMeetingDto> popularMeetings;
    private List<UpcomingEventDto> upcomingEvents;
    private List<LatestQuestionDto> latestQuestions;
}