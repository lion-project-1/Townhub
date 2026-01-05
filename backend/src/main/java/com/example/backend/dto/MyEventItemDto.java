package com.example.backend.dto;

import com.example.backend.enums.EventStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyEventItemDto implements CursorSupport{

    private final Long eventId;
    private final String title;
    private final EventStatus status;
    private final long participantCount;
    private final int capacity;
    private final LocalDateTime joinedAt;

    @Override
    public Long getCursor() {
        return eventId;
    }
}
