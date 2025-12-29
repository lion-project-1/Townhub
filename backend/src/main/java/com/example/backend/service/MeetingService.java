package com.example.backend.service;

import com.example.backend.domain.Location;
import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingMember;
import com.example.backend.domain.User;
import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.enums.MeetingStatus;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.MeetingJoinRequestRepository;
import com.example.backend.repository.MeetingMemberRepository;
import com.example.backend.repository.MeetingRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final MeetingJoinRequestRepository meetingJoinRequestRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public Long createMeeting(Long userId, MeetingCreateRequest request) {

        User host = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        Meeting meeting = getMeeting(request, location, host);

        meetingRepository.save(meeting);

        MeetingMember hostMember = MeetingMember.createHost(meeting, host);
        meetingMemberRepository.save(hostMember);

        return meeting.getId();
    }

    private static Meeting getMeeting(MeetingCreateRequest request, Location location, User host) {
        return Meeting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(location)
                .meetingPlace(request.getMeetingPlace())
                .schedule(request.getSchedule())
                .capacity(request.getCapacity())
                .status(MeetingStatus.RECRUITING)
                .host(host)
                .build();
    }

    // TODO: 모임 목록 조회
    // TODO: 모임 상세 조회
    // TODO: 모임 수정
}