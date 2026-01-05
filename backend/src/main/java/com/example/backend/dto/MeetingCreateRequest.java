package com.example.backend.dto;

import com.example.backend.enums.MeetingCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingCreateRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull(message = "모임 카테고리는 필수입니다.")
    private MeetingCategory category;

    @NotNull
    private Long locationId;

    @NotBlank
    private String meetingPlace;

    @NotBlank
    private String schedule;

    @Min(2)
    @Max(100)
    private int capacity;
}
