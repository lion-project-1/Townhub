package com.example.backend.dto;

import com.example.backend.enums.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionUpdateRequest {
    private QuestionCategory questionCategory;

    private String title;

    private String content;
}