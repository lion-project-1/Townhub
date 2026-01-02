package com.example.backend.service;

import static com.example.backend.mapper.MeetingMapper.toMeeting;
import static com.example.backend.mapper.MeetingMapper.toMeetingDetailResponse;

import com.example.backend.common.annotation.MeasureTime;
import com.example.backend.domain.Location;
import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingJoinRequest;
import com.example.backend.domain.MeetingMember;
import com.example.backend.domain.User;
import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.dto.MeetingDetailResponse;
import com.example.backend.dto.MeetingJoinRequestResponse;
import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingMemberResponse;
import com.example.backend.dto.MeetingSearchCondition;
import com.example.backend.dto.MeetingUpdateRequest;
import com.example.backend.enums.JoinRequestStatus;
import com.example.backend.enums.MeetingMemberRole;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.mapper.MeetingMapper;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.MeetingJoinRequestRepository;
import com.example.backend.repository.MeetingMemberRepository;
import com.example.backend.repository.MeetingRepository;
import com.example.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final MeetingJoinRequestRepository meetingJoinRequestRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public Long createMeeting(Long userId, MeetingCreateRequest request) {

        User host =  getUser(userId);

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        Meeting meeting = toMeeting(request, location, host);
        meetingRepository.save(meeting);

        MeetingMember hostMember = MeetingMember.createHost(meeting, host);
        meetingMemberRepository.save(hostMember);

        return meeting.getId();
    }

    @Transactional
    public void updateMeeting(
            Long meetingId,
            Long userId,
            MeetingUpdateRequest request) {

        Meeting meeting = getMeeting(meetingId);

        validateHost(meetingId, userId);

        meeting.update(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getMeetingPlace(),
                request.getSchedule(),
                request.getCapacity()
        );
    }

    @Transactional(readOnly = true)
    public MeetingDetailResponse getMeetingDetail(Long meetingId) {

        Meeting meeting = getMeeting(meetingId);

        List<MeetingMemberResponse> members = meeting.getMembers().stream()
                .map(MeetingMapper::toMeetingMemberResponse)
                .toList();

        return toMeetingDetailResponse(meeting, members);
    }

    @Transactional
    public void requestJoin(Long meetingId, Long userId, String message) {

        User user = getUser(userId);

        Meeting meeting = getMeeting(meetingId);

        if (meetingMemberRepository.existsByMeetingAndUser(meeting, user)) {
            throw new CustomException(ErrorCode.ALREADY_MEETING_MEMBER);
        }

        if (meetingJoinRequestRepository.existsByMeetingAndUser(meeting, user)) {
            throw new CustomException(ErrorCode.ALREADY_MEETING_REQUESTED);
        }

        checkMeetingCapacity(meeting);

        MeetingJoinRequest joinRequest = getMeetingJoinRequest(message, meeting, user);

        meetingJoinRequestRepository.save(joinRequest);
    }

    private void checkMeetingCapacity(Meeting meeting) {
        if (meetingMemberRepository.countByMeeting(meeting) >= meeting.getCapacity()) {
            throw new CustomException(ErrorCode.MEETING_IS_FULL);
        }
    }

    @Transactional(readOnly = true)
    public List<MeetingJoinRequestResponse> getJoinRequests(Long meetingId, Long hostUserId ) {

        Meeting meeting = getMeeting(meetingId);
        User host = getUser(hostUserId);

        validateHost(meetingId, hostUserId);

        return meetingJoinRequestRepository
                .findByMeetingAndStatus(meeting, JoinRequestStatus.PENDING)
                .stream()
                .map(req -> new MeetingJoinRequestResponse(
                        req.getId(),
                        req.getUser().getId(),
                        req.getUser().getNickname(),
                        req.getMessage(),
                        req.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    @MeasureTime
    public void approveJoinRequest(Long meetingId, Long requestId, Long hostUserId) {
        Meeting meeting = getMeeting(meetingId);
        User host = getUser(hostUserId);

        validateHost(meetingId, hostUserId);

        log.info("여기 체크");

        checkMeetingCapacity(meeting);

        MeetingJoinRequest request = meetingJoinRequestRepository
                .findByIdAndMeeting(requestId, meeting)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_REQUEST_NOT_FOUND));

        if (meetingMemberRepository.existsByMeetingAndUser(meeting, request.getUser())) {
            request.approve();
            return;
        }

        request.approve();

        meetingMemberRepository.save(MeetingMember.createMember(meeting, request.getUser()));
    }


    @Transactional
    public void rejectJoinRequest(Long meetingId, Long requestId, Long hostUserId) {
        Meeting meeting = getMeeting(meetingId);
        validateHost(meetingId, hostUserId);

        MeetingJoinRequest request = meetingJoinRequestRepository
                .findByIdAndMeeting(requestId, meeting)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_REQUEST_NOT_FOUND));

        request.reject();
    }

    private Meeting getMeeting(Long meetingId) {
        return meetingRepository.findById(meetingId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private static MeetingJoinRequest getMeetingJoinRequest(String message, Meeting meeting, User user) {
        return MeetingJoinRequest.builder()
                .meeting(meeting)
                .user(user)
                .message(message)
                .status(JoinRequestStatus.PENDING)
                .build();
    }

    public Page<MeetingListResponse> getMeetingList(MeetingSearchCondition condition, Pageable pageable) {
        return meetingRepository.findMeetingList(condition, pageable);
    }

    private void validateHost(Long meetingId, Long userId) {
        if (!meetingMemberRepository.existsByMeetingIdAndUserIdAndRole(
                meetingId, userId, MeetingMemberRole.HOST)) {
            throw new CustomException(ErrorCode.MEETING_HOST_ONLY);
        }
    }
}