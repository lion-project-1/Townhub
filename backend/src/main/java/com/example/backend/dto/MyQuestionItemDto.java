package com.example.backend.dto;

import com.example.backend.enums.QuestionCategory;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class MyQuestionItemDto implements CursorSupport {

    private final Long questionId;
    private final String title;
    private final String category;
    private final LocalDateTime createdAt;
    private final long answerCount;

    public MyQuestionItemDto(
            Long id,
            String title,
            String category,
            LocalDateTime createdAt,
            Long answerCount) {
        this.questionId = id;
        this.title = title;
        this.category = category;
        this.createdAt = createdAt;
        this.answerCount = answerCount;
    }

    @Override
    public Long getCursor() {
        return questionId; // 커서 = 질문 id
    }
}
