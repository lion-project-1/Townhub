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
import com.example.backend.global.response.ApiResponse;
import org.springframework.http.ResponseEntity;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService myPageService;


    @GetMapping
    public ResponseEntity<ApiResponse<MyPageResponse>> getMyPage(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        MyPageResponse response =
                myPageService.getMyPage(userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Void>> updateMyPage(
            @RequestBody @Valid MyPageUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        myPageService.updateMyPage(userDetails.getUsername(), request);

        return ResponseEntity.ok(
                ApiResponse.success("내 정보 수정 완료", null));
    }



    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        myPageService.withdraw(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("회원 탈퇴 완료", null));
    }
}
