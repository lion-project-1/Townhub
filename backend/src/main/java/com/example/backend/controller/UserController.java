package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.*;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.security.cookie.RefreshTokenCookieManager;
import com.example.backend.security.jwt.JwtProvider;
import com.example.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
        TokenReissueResult result = userService.reissue(refreshToken);

        if (!StringUtils.hasText(refreshToken)) {
            ResponseCookie deleteCookie = refreshTokenCookieManager.delete();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                    .body(ApiResponse.fail(ErrorCode.TOKEN_NOT_FOUND));
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

    @GetMapping("/mypage")
    public ResponseEntity<ApiResponse<UserMyPageResponseDto>> getMyPage(
            @AuthenticationPrincipal User user) {

        UserMyPageResponseDto myInfo = userService.getMyPage(user.getId());
        return ResponseEntity.ok(ApiResponse.success(myInfo));
    }

    @PatchMapping("/me")
    public ApiResponse<Void> updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody UserUpdateRequest request) {
        userService.updateUser(user.getId(), request);
        return ApiResponse.success("사용자 정보가 수정되었습니다.");
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> withdraw(
            @AuthenticationPrincipal User user,
            @RequestBody UserWithdrawRequest request) {
        userService.withdraw(user.getId(), request.getCurrentPassword());
        return ApiResponse.success("회원 탈퇴가 완료되었습니다.");
    }

}
