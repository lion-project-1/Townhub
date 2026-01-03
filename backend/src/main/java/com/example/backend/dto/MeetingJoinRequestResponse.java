package com.example.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingJoinRequestResponse {

    private Long requestId;
    private Long userId;
    private String userName;
    private String message;
    private LocalDateTime requestedAt;
}
