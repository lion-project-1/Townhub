package com.example.backend.controller;

import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.dto.MeetingCreateResponse;
import com.example.backend.dto.MeetingUpdateRequest;
import com.example.backend.enums.MeetingStatus;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MeetingController {

    private final MeetingService meetingService;
    private Long tmpId = 1L;

    @PostMapping
    public ResponseEntity<ApiResponse<MeetingCreateResponse>> createMeeting(
            //@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid MeetingCreateRequest request) {

        Long meetingId = meetingService.createMeeting(//userPrincipal.getUserId(),
                 tmpId, request);

        MeetingCreateResponse response =
                new MeetingCreateResponse(meetingId, MeetingStatus.RECRUITING);

        // 추후에 메시지를 상수/enum 변경 고려
        return ResponseEntity.ok(ApiResponse.success("모임이 생성되었습니다.", response));
    }

    // TODO: 모임 목록 조회 API
    // @GetMapping

    // TODO: 모임 상세 조회 API
    // @GetMapping("/{meetingId}")

    @PatchMapping("/{meetingId}")
    public ResponseEntity<ApiResponse<Void>> updateMeeting(
            @PathVariable Long meetingId,
            //@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody MeetingUpdateRequest request) {

        Long tmpId = 1L;

        meetingService.updateMeeting(
                meetingId,
                //userPrincipal.getUserId(),
                tmpId,
                request
        );

        return ResponseEntity.ok(ApiResponse.success("모임이 변경되었습니다.", null));
    }
}
