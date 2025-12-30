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

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/questions")
@CrossOrigin("*")
public class QuestionController {

    private final QuestionService questionService;


    // 질문 생성
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(@RequestBody QuestionCreateRequest request
                                                    //@AuthenticationPrincipal CustomUserDetails user
    ) {
        Long tmpUserId = 1L;

        Long questionId = questionService.createQuestion(tmpUserId, request);

        return ResponseEntity.ok(ApiResponse.success(questionId));
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


    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable Long questionId
            //@AuthenticationPrincipal CustomUserDetails user
    ) {
        Long tmpUserId = 1L;

        questionService.deleteQuestion(questionId, tmpUserId);
        return ResponseEntity.ok(ApiResponse.success("질문이 삭제되었습니다."));
    }
}

