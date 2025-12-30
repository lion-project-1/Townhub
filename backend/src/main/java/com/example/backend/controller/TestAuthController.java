package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.global.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestAuthController {
    // AccessToken 유효하지 않거나 없으면 접근 불가
    @GetMapping("/auth")
    public ResponseEntity<ApiResponse<String>> auth(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                ApiResponse.success("인증 성공", "userId=" + user.getId() + ", email=" + user.getEmail())
        );
    }
}


