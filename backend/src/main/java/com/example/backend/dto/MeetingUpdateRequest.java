package com.example.backend.dto;

import com.example.backend.enums.MeetingCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingUpdateRequest {

    private String title;
    private String description; // 빈 문자열 허용
    private MeetingCategory category;
    private Long locationId;
    private String meetingPlace;
    private String schedule;
    private Integer capacity;
}
