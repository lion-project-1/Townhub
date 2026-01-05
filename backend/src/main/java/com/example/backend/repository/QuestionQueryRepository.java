package com.example.backend.repository;

import com.example.backend.dto.MyQuestionItemDto;
import java.util.List;

public interface QuestionQueryRepository {
    List<MyQuestionItemDto> findMyQuestions(Long userId, Long cursor, int sizePlusOne);
}
