package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.dto.MyPageResponse;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MyPageService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public MyPageResponse getMyPage(String email) {

        if (email == null || email.isBlank()) {
            throw new CustomException(ErrorCode.MYPAGE_UNAUTHORIZED);
        }

        Member member = memberRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() ->
                                new CustomException(ErrorCode.MYPAGE_MEMBER_NOT_FOUND)
                );

        return new MyPageResponse(
                member.getEmail(),
                member.getNickname(),
                member.getProfileImage(),
                member.getIntroduction()
        );
    }

    public void updateMyPage(String email, MyPageUpdateRequest request) {

        if (email == null || email.isBlank()) {
            throw new CustomException(ErrorCode.MYPAGE_UNAUTHORIZED);
        }

        Member member = memberRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MYPAGE_MEMBER_NOT_FOUND)
                );

        if (!member.getNickname().equals(request.getNickname())
                && memberRepository.existsByNicknameAndDeletedFalse(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        member.updateProfile(
                request.getNickname(),
                request.getProfileImage(),
                request.getIntroduction()
        );
    }

    public void withdraw(String email) {

        if (email == null || email.isBlank()) {
            throw new CustomException(ErrorCode.MYPAGE_UNAUTHORIZED);
        }

        Member member = memberRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MYPAGE_MEMBER_NOT_FOUND)
                );

        member.withdraw(); // deleted = true
    }
}

