package com.example.backend.dto;

import com.example.backend.enums.MeetingStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyMeetingItemDto implements CursorSupport {

    private Long meetingId;
    private String title;
    private MeetingStatus status;
    private Long participantCount;
    private Integer capacity;
    private LocalDateTime joinedAt;


    @Override
    public Long getCursor() {
        return meetingId;
    }
}
