package com.example.backend.dto;


import com.example.backend.domain.Location;
import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import com.example.backend.enums.QuestionCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 요청 DTO (질문 등록)
public class QuestionCreateRequest {
    private String title;
    private String content;
    private QuestionCategory questionCategory;
    private Long userId;

    public QuestionCreateRequest(Question question) {
        this.title = question.getTitle();
        this.content = question.getContent();
        this.questionCategory = question.getQuestionCategory();
        this.userId = question.getUser().getId();
    }
}
