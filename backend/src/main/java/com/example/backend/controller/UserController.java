package com.example.backend.controller;


import com.example.backend.dto.*;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED).body(ApiResponse.success("회원가입 완료", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("로그인 성공", response));
    }

    @PostMapping("/token/reissue")
    public ResponseEntity<ApiResponse<TokenReissueResponse>> reissue(@RequestBody TokenReissueRequest request) {
        TokenReissueResponse response = userService.reissue(request);
        return ResponseEntity.ok(
                ApiResponse.success("토큰 재발급 성공", response));
    }
}
