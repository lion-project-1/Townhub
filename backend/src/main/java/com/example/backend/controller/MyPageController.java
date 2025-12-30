package com.example.backend.controller;

import com.example.backend.dto.MyPageResponse;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.service.MyPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.backend.exception.BadRequestException;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService myPageService;


    @GetMapping
    public MyPageResponse getMyPage(
            @AuthenticationPrincipal UserDetails user,
            @RequestHeader(value = "X-USER-EMAIL", required = false) String email
    ) {
        String targetEmail = (user != null) ? user.getUsername() : email;
        if (targetEmail == null || targetEmail.isBlank()) {
            throw new BadRequestException("인증 정보가 없습니다. (Authorization 또는 X-USER-EMAIL 필요)");
        }
        return myPageService.getMyPage(targetEmail);
    }

    @PutMapping
    public void updateMyPage(
            @AuthenticationPrincipal UserDetails user,
            @RequestHeader(value = "X-USER-EMAIL", required = false) String email,
            @Valid @RequestBody MyPageUpdateRequest request
    ) {
        String targetEmail = (user != null) ? user.getUsername() : email;
        if (targetEmail == null || targetEmail.isBlank()) {
            throw new BadRequestException("인증 정보가 없습니다. (Authorization 또는 X-USER-EMAIL 필요)");
        }
        myPageService.updateMyPage(targetEmail, request);
    }


    @DeleteMapping
    public void withdraw(
            @AuthenticationPrincipal UserDetails user,
            @RequestHeader(value = "X-USER-EMAIL", required = false) String email
    ) {
        String targetEmail = (user != null) ? user.getUsername() : email;
        if (targetEmail == null || targetEmail.isBlank()) {
            throw new BadRequestException("인증 정보가 없습니다. (Authorization 또는 X-USER-EMAIL 필요)");
        }
        myPageService.withdraw(targetEmail);
    }
}
