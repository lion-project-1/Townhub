package com.example.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LatestQuestionDto {
    private Long id;
    private String title;
    private String author;
    private LocalDateTime createdAt;

}