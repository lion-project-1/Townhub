package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.dto.MeetingCreateResponse;
import com.example.backend.dto.MeetingDetailResponse;
import com.example.backend.dto.MeetingJoinRequestDto;
import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingSearchCondition;
import com.example.backend.dto.MeetingUpdateRequest;
import com.example.backend.enums.MeetingStatus;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@Slf4j
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    public ResponseEntity<ApiResponse<MeetingCreateResponse>> createMeeting(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid MeetingCreateRequest request) {

        Long meetingId = meetingService.createMeeting(user.getId(), request);

        MeetingCreateResponse response =
                new MeetingCreateResponse(meetingId, MeetingStatus.RECRUITING);

        // 추후에 메시지를 상수/enum 변경 고려
        return ResponseEntity.ok(ApiResponse.success("모임이 생성되었습니다.", response));
    }

    @GetMapping("/{meetingId}")
    public ResponseEntity<ApiResponse<MeetingDetailResponse>> getMeetingDetail(
            @PathVariable Long meetingId) {

        MeetingDetailResponse response = meetingService.getMeetingDetail(meetingId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MeetingListResponse>>> getMeetingList(
            MeetingSearchCondition condition,
            @PageableDefault(page = 0, size = 6, sort = "createdAt", direction = Direction.DESC) Pageable pageable) {

        Page<MeetingListResponse> meetingList
                = meetingService.getMeetingList(condition, pageable);

        return ResponseEntity.ok(ApiResponse.success(meetingList));
    }


    @PatchMapping("/{meetingId}")
    public ResponseEntity<ApiResponse<Void>> updateMeeting(
            @PathVariable Long meetingId,
            @AuthenticationPrincipal User user,
            @RequestBody MeetingUpdateRequest request) {

        meetingService.updateMeeting(
                meetingId,
                user.getId(),
                request
        );

        return ResponseEntity.ok(ApiResponse.success("모임이 변경되었습니다.", null));
    }

    @PostMapping("/{meetingId}/join")
    public ResponseEntity<ApiResponse<Void>> requestJoin(
            @PathVariable Long meetingId,
            @Valid @RequestBody(required = false) MeetingJoinRequestDto request,
            @AuthenticationPrincipal User user) {

        String message = request != null ? request.getMessage() : null;
        meetingService.requestJoin(meetingId, user.getId(), message);

        return ResponseEntity.ok(ApiResponse.success("모임 가입이 신청되었습니다.", null));
    }
}
