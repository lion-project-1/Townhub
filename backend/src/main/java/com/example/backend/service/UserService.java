package com.example.backend.service;

import com.example.backend.domain.MeetingMember;
import com.example.backend.domain.RefreshToken;
import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import com.example.backend.dto.*;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.AnswerRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.MeetingMemberRepository;
import com.example.backend.repository.MeetingRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LocationRepository locationRepository;
    private final MeetingRepository meetingRepository;
    // private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final MeetingMemberRepository meetingMemberRepository;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        Location location = locationRepository.findByProvinceAndCity(
                request.getProvince(),
                request.getCity()
        ).orElseGet(() -> locationRepository.save(Location.builder()
                .province(request.getProvince())
                .city(request.getCity())
                .build()));

        User user = request.toEntity(encodedPassword, location);

        User savedUser = userRepository.save(user);
        return SignupResponse.from(savedUser);
    }

    @Transactional
    public LoginResult login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_LOGIN);
        }

        refreshTokenRepository.deleteByUserId(user.getId()); // 기존 RefreshToken 제거

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtProvider.createRefreshToken(user.getId());

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .userId(user.getId())
                .expiredAt(jwtProvider.refreshTokenExpiresAt())
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return LoginResult.builder()
                .response(
                        LoginResponse.builder()
                                .userId(user.getId())
                                .email(user.getEmail())
                                .nickname(user.getNickname())
                                .accessToken(accessToken)
                                .build()
                )
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public TokenReissueResult reissue(String refreshToken) {
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new CustomException(ErrorCode.TOKEN_INVALID));

        // 만료 시 로그아웃
        if (oldRefreshToken.isExpired()) {
            refreshTokenRepository.delete(oldRefreshToken);
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        }

        // AccessToken 재발급할 때 RefreshToken 도 삭제 후 재발급
        refreshTokenRepository.delete(oldRefreshToken);

        User user = userRepository.findById(oldRefreshToken.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtProvider.createAccessToken(
                user.getId(),
                user.getEmail()
        );
        String newRefreshToken = jwtProvider.createRefreshToken(user.getId());

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .userId(user.getId())
                        .token(newRefreshToken)
                        .expiredAt(jwtProvider.refreshTokenExpiresAt())
                        .build()
        );

        return TokenReissueResult.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) return; // 쿠키 있는지 확인

        refreshTokenRepository.deleteByToken(refreshToken);
    }

    @Transactional(readOnly = true)
    public UserMyPageResponseDto getMyPage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String location = null;
        if (user.getLocation() != null) {
            location = user.getLocation().getProvince() + " " + user.getLocation().getCity();
        }

        return UserMyPageResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .location(location)
                .createdAt(user.getCreatedAt())
                .groups(meetingRepository.countByHostId(userId))
                .events(-1)//eventRepository.countByUserId(userId))
                .qna(questionRepository.countByUserId(userId))
                .build();
    }

    @Transactional
    public void updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        checkPassword(request.getCurrentPassword(), user);

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.changePassword(passwordEncoder.encode(request.getNewPassword()));
        }

        String[] locationInfo = parseLocationInfo(request);

        Location location = locationRepository
                .findByProvinceAndCity(locationInfo[0], locationInfo[1])
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        user.changeLocation(location);
    }

    private static String[] parseLocationInfo(UserUpdateRequest request) {
        String locationStr = request.getLocation();
        String[] parts = locationStr.split(" ");
        if (parts.length < 2) {
            throw new CustomException(ErrorCode.LOCATION_NOT_FOUND);
        }

        return parts;
    }

    @Transactional
    public void withdraw(Long userId, String currentPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        checkPassword(currentPassword, user);

        meetingMemberRepository.deleteByUser(user);
        answerRepository.deleteByUser(user);
        questionRepository.deleteByUser(user);
        userRepository.deleteById(userId);
    }

    private void checkPassword(String currentPassword, User user) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }
    }
}
