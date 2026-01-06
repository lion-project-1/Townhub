package com.example.backend.repository;

import com.example.backend.domain.Question;
import com.example.backend.dto.LatestQuestionDto;
import com.example.backend.dto.MyQuestionItemDto;
import com.example.backend.dto.QuestionSearchRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QuestionQueryRepository {
    List<MyQuestionItemDto> findMyQuestions(Long userId, Long cursor, int sizePlusOne);

    Page<Question> search(QuestionSearchRequest request, Pageable pageable);

    long countByTown(Long townId);

    List<LatestQuestionDto> findLatestQuestions(Long townId, int limit);

}
