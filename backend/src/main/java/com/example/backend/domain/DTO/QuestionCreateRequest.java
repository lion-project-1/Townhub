package com.example.backend.domain.DTO;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 요청 DTO (질문 등록)
public class QuestionCreateRequest {

    private String title;
    private String content;

}
