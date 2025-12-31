package com.example.backend.dto;

import com.example.backend.enums.MeetingCategory;
import com.example.backend.enums.MeetingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MeetingListResponse {

    private Long meetingId;
    private String title;
    private String description;

    private MeetingCategory category;
    private MeetingStatus status;

    private String province;
    private String city;

    private int capacity;
    private long memberCount;
}
