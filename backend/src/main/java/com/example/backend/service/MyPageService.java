package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.dto.MyPageResponse;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.NotFoundException;
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
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("회원이 없습니다."));
        return new MyPageResponse(
                member.getEmail(),
                member.getNickname(),
                member.getProfileImage(),
                member.getIntroduction()

        );
    }

    public void updateMyPage(String email, MyPageUpdateRequest request) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("회원이 없습니다."));

        // 닉네임 중복 체크 (자기 자신은 허용)
        if (!member.getNickname().equals(request.getNickname())
                && memberRepository.existsByNickname(request.getNickname())) {
            throw new BadRequestException("이미 사용 중인 닉네임입니다.");
        }

        member.updateProfile(
                request.getNickname(),
                request.getProfileImage(),
                request.getIntroduction()
        );
    }
    public void withdraw(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("회원이 없습니다."));

        if (member.isDeleted()) {
            throw new BadRequestException("이미 탈퇴한 회원입니다.");
        }

        member.withdraw(); // deleted = true
    }

}
