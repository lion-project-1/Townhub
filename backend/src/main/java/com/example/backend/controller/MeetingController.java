package com.example.backend.controller;

import com.example.backend.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    // TODO: 모임 생성 API
    // @PostMapping

    // TODO: 모임 목록 조회 API
    // @GetMapping

    // TODO: 모임 상세 조회 API
    // @GetMapping("/{meetingId}")

    // TODO: 모임 수정 API
    // @PatchMapping("/{meetingId}")
}
