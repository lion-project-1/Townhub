package com.example.backend.dto;


import com.example.backend.domain.Question;
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
public class QuestionResponseRequest {

    private Long id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime createdAt;

    public QuestionResponseRequest(Question question) {
        this.id = question.getId();
        this.title = question.getTitle();
        this.content = question.getContent();
        this.writer = question.getUser().getNickname();
        this.createdAt = question.getCreatedAt();
    }
}
