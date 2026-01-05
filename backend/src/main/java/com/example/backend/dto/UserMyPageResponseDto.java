package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserMyPageResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private String location;
    private LocalDateTime createdAt;

    private long groups;
    private long events;
    private long qna;
}
