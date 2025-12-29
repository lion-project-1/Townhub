package com.example.backend.service;

import com.example.backend.domain.RefreshToken;
import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import com.example.backend.dto.*;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        Location location = locationRepository.findByProvinceAndCityAndTown(
                request.getProvince(),
                request.getCity(),
                request.getTown()
        ).orElseGet(() -> locationRepository.save(Location.builder()
                .province(request.getProvince())
                .city(request.getCity())
                .town(request.getTown())
                .build()));

        User user = request.toEntity(encodedPassword, location);

        User savedUser = userRepository.save(user);
        return SignupResponse.from(savedUser);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
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
                .expiredAt(jwtProvider.getRefreshTokenExpiredAt())
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional(readOnly = true)
    public TokenReissueResponse reissue(TokenReissueRequest request) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new CustomException(ErrorCode.TOKEN_INVALID));

        if (refreshToken.isExpired()) {
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtProvider.createAccessToken(
                user.getId(),
                user.getEmail()
        );

        return TokenReissueResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }
}
