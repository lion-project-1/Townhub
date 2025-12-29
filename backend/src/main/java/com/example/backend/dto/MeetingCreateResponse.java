package com.example.backend.dto;

import com.example.backend.enums.MeetingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingCreateResponse {

    private Long meetingId;
    private MeetingStatus status;
}
