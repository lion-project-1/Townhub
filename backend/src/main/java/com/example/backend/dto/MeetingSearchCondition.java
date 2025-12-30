package com.example.backend.dto;

import com.example.backend.enums.MeetingCategory;
import com.example.backend.enums.MeetingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetingSearchCondition {

    private MeetingCategory category;
    private MeetingStatus status;
    private String keyword;

    private String province;
    private String city;
    private String town;

}
