package com.example.backend.dto;

import com.example.backend.enums.MeetingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChangeMeetingStatusRequest {

    @NotNull(message = "변경할 모임 상태는 필수입니다.")
    private MeetingStatus status;
}