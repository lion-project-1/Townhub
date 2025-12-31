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
    private Long Id;
    private String title;
    private String content;
    private QuestionCategory questionCategory;
    private Long locationId;
    private Long userId;

    public QuestionCreateRequest(Question question) {
        this.Id = question.getId();
        this.title = question.getTitle();
        this.content = question.getContent();
        this.questionCategory = question.getQuestionCategory();
        this.locationId = question.getLocation().getId();
        this.userId = question.getUser().getId();
    }
}
