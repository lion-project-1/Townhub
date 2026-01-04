package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.*;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.security.cookie.RefreshTokenCookieManager;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RefreshTokenCookieManager refreshTokenCookieManager;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(
            @RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED).body(ApiResponse.success("회원가입 완료", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody LoginRequest request) {
        LoginResult result = userService.login(request);

        ResponseCookie cookie =
                refreshTokenCookieManager.create(result.getRefreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success("로그인 성공", result.getResponse()));
    }

    @PostMapping("/token/reissue")
    public ResponseEntity<ApiResponse<TokenReissueResponse>> reissue(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            ResponseCookie deleteCookie = refreshTokenCookieManager.delete();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                    .body(ApiResponse.fail(
                            ErrorCode.TOKEN_NOT_FOUND.getCode(),
                            ErrorCode.TOKEN_NOT_FOUND.getMessage(),
                            null
                    ));
        }

        TokenReissueResult result;
        try {
            result = userService.reissue(refreshToken);
        } catch (CustomException e) {
            ErrorCode code = e.getErrorCode();
            if (code == ErrorCode.TOKEN_INVALID || code == ErrorCode.TOKEN_EXPIRED) {
                ResponseCookie deleteCookie = refreshTokenCookieManager.delete();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                        .body(ApiResponse.fail(code.getCode(), code.getMessage(), null));
            }
            throw e;
        }

        ResponseCookie cookie = refreshTokenCookieManager.create(result.getRefreshToken());

        TokenReissueResponse body = TokenReissueResponse.builder()
                .accessToken(result.getAccessToken())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success("토큰 재발급 성공", body));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        userService.logout(refreshToken);

        ResponseCookie cookie = refreshTokenCookieManager.delete();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success("로그아웃 완료", null));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<DuplicateCheckResponse>> checkEmail(
            @RequestParam("email") String email
    ) {
        boolean available = userService.isEmailAvailable(email);
        return ResponseEntity.ok(ApiResponse.success("이메일 중복 검증 완료", new DuplicateCheckResponse(available)));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<ApiResponse<DuplicateCheckResponse>> checkNickname(
            @RequestParam("nickname") String nickname
    ) {
        boolean available = userService.isNicknameAvailable(nickname);
        return ResponseEntity.ok(ApiResponse.success("닉네임 중복 검증 완료", new DuplicateCheckResponse(available)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserMeResponse>> me(@AuthenticationPrincipal User user) {
        UserMeResponse response = userService.me(user.getId());
        return ResponseEntity.ok(ApiResponse.success("내 정보 조회 성공", response));
    }

}
