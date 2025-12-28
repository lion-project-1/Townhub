package com.example.backend.service;

import com.example.backend.repository.MeetingJoinRequestRepository;
import com.example.backend.repository.MeetingMemberRepository;
import com.example.backend.repository.MeetingRepository;
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

    // TODO: 모임 생성
    // TODO: 모임 목록 조회
    // TODO: 모임 상세 조회
    // TODO: 모임 수정
}