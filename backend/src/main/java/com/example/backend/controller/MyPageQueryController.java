package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.CursorPageResponse;
import com.example.backend.dto.MyMeetingItemDto;
import com.example.backend.dto.MyQuestionItemDto;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.MyPageQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class MyPageQueryController {

    private final MyPageQueryService myPageQueryService;

    @GetMapping("/meetings")
    public ApiResponse<CursorPageResponse<MyMeetingItemDto>> myMeetings(
            @AuthenticationPrincipal User user,
            @RequestParam(name = "cursor", required = false) Long cursor,
            @RequestParam(name = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.success(myPageQueryService.getMyMeetings(user.getId(), cursor, size));
    }

    // @GetMapping("/events")
    // public ApiResponse<CursorPageResponse<MyEventItemDto>> myEvents(
    //         @AuthenticationPrincipal User user,
    //         @RequestParam(name = "cursor", required = false) Long cursor,
    //         @RequestParam(name = "size", defaultValue = "5") int size
    // ) {
    //     return ApiResponse.success(myPageQueryService.getMyEvents(user.getId(), cursor, size));
    // }


    @GetMapping("/questions")
    public ApiResponse<CursorPageResponse<MyQuestionItemDto>> myQuestions(
            @RequestParam(name = "cursor", required = false) Long cursor,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.success(myPageQueryService.getMyQuestions(user.getId(), cursor, size));
    }
}
