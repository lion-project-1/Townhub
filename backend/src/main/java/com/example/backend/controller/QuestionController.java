package com.example.backend.controller;

import com.example.backend.dto.QuestionCreateRequest;
import com.example.backend.dto.QuestionResponseRequest;
import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/town/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // 질문 생성
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody QuestionCreateRequest request) {
        Long tmpUserId = 1L;

        questionService.createQuestion(tmpUserId, request);

        return ResponseEntity.ok(ApiResponse.success("질문이 생성되었습니다."));
    }

    // 질문 리스트
    @GetMapping
    public List<QuestionResponseRequest> list() {
        return questionService.getQuestions();
    }

    // 질문 상세
    @GetMapping("/{id}")
    public QuestionResponseRequest detail(@PathVariable Long id) {
        return questionService.getQuestion(id);
    }


    // 질문 업데이트
    @PatchMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionUpdateRequest request
            //@AuthenticationPrincipal CustomUserDetails user
    ) {
        Long tmpUserId = 1L;

        questionService.updateQuestion(questionId, tmpUserId, request);

        return ResponseEntity.ok(ApiResponse.success("질문이 수정되었습니다."));
    }

}

