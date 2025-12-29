package com.example.backend.dto;

import com.example.backend.enums.MeetingCategory;
import com.example.backend.enums.MeetingStatus;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
@Getter
@AllArgsConstructor
@Builder
public class MeetingDetailResponse {

    private Long meetingId;
    private String title;
    private String description;
    private MeetingCategory category;
    private String meetingPlace;
    private String schedule;
    private int capacity;
    private MeetingStatus status;

    private String province;
    private String city;
    private String town;

    private List<MeetingMemberResponse> members;
}
