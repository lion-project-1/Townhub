package com.example.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class MeetingJoinRequestDto {
    @Size(max = 30, message = "가입 문구는 30자 이내로 작성 바랍니다.")
    private String message;
}
