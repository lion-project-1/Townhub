package com.example.backend.domain.DTO;


import com.example.backend.domain.QuestionEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//응답 DTO (질문 조회용)
public class QuestionResponse {

    private Long id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime createdAt;

    public QuestionResponse(QuestionEntity question) {
        this.id = question.getId();
        this.title = question.getTitle();
        this.content = question.getContent();
        this.writer = question.getUser().getName();
        this.createdAt = question.getCreatedAt();
    }
}
