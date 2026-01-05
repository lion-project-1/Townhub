package com.example.backend.dto;


import com.example.backend.domain.Question;
import com.example.backend.enums.QuestionCategory;
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
    private Long authorId;
    private String writer;
    private QuestionCategory category;
    private int views;
    private LocalDateTime createdAt;



    public QuestionResponseRequest(Question question) {
        this.id = question.getId();
        this.title = question.getTitle();
        this.content = question.getContent();
        this.authorId = question.getId();
        this.writer = question.getUser().getNickname();
        this.category = question.getQuestionCategory();
        this.views = question.getViewCount();          // 또는 랜덤/고정값
        this.createdAt = question.getCreatedAt();

    }
}
