package com.example.backend.service;

import com.example.backend.dto.CursorPageResponse;
import com.example.backend.dto.MyMeetingItemDto;
import com.example.backend.dto.MyQuestionItemDto;
import com.example.backend.repository.MeetingRepository;
import com.example.backend.repository.QuestionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageQueryService {

    private final MeetingRepository meetingRepository;
    //private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;

    public CursorPageResponse<MyMeetingItemDto> getMyMeetings(Long userId, Long cursor, int size) {
        List<MyMeetingItemDto> items = meetingRepository.findMyMeetings(userId, cursor, size + 1);

        return CursorPageResponse.of(items, size);
    }

    // public CursorPageResponse<MyEventItemDto> getMyEvents(Long userId, Long cursor, int size) {
    //     List<MyEventItemDto> items = eventRepository.findMyEvents(userId, cursor, PageRequest.of(0, size + 1));
    //     return CursorPageResponse.of(items, size);
    // }

    public CursorPageResponse<MyQuestionItemDto> getMyQuestions(Long userId, Long cursor, int size) {

        List<MyQuestionItemDto> items =
                questionRepository.findMyQuestions(userId, cursor, size + 1);

        return CursorPageResponse.of(items, size);
    }

}
