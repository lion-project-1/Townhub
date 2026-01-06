package com.example.backend.service;

import com.example.backend.domain.Location;
import com.example.backend.dto.TownDashboardResponse;
import com.example.backend.dto.TownStatsDto;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.MeetingRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TownDashboardService {

    private final LocationRepository locationRepository;
    private final MeetingRepository meetingQueryRepository;
    private final EventRepository eventQueryRepository;
    private final QuestionRepository questionQueryRepository;
    private final UserRepository userRepository;

    public TownDashboardResponse getDashboard(Long townId) {

        Location location = locationRepository.findById(townId)
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        TownStatsDto stats = TownStatsDto.builder()
                .activeMeetings(meetingQueryRepository.countActiveMeetings(townId))
                .upcomingEvents(eventQueryRepository.countActiveEvents(townId))
                .totalQuestions(questionQueryRepository.countByTown(townId))
                .activeUsers(userRepository.countUserByLocation(location))
                .build();

        return TownDashboardResponse.builder()
                .stats(stats)
                .popularMeetings(
                        meetingQueryRepository.findPopularMeetings(townId, 3)
                )
                .upcomingEvents(
                        eventQueryRepository.findUpcomingEvents(townId, 3)
                )
                .latestQuestions(
                        questionQueryRepository.findLatestQuestions(townId, 3)
                )
                .build();
    }
}