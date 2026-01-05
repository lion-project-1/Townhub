package com.example.backend.controller;


import com.example.backend.domain.User;
import com.example.backend.dto.QuestionCreateRequest;
import com.example.backend.dto.QuestionResponseRequest;


import com.example.backend.dto.QuestionSearchRequest;
import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.QuestionService;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse<Long>> create(@RequestBody QuestionCreateRequest request,
                                                    @AuthenticationPrincipal User user) {

        Long questionId = questionService.createQuestion(user.getId(), request);

        return ResponseEntity.ok(ApiResponse.success(questionId));
    }


    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuestionResponseRequest>>> list(
            QuestionSearchRequest request,
            @PageableDefault(page = 0, size = 6) Pageable pageable) {
        Page<QuestionResponseRequest> result =
                questionService.getQuestions(request, pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }



    // 질문 상세
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionResponseRequest>> getQuestionData(
            @PathVariable Long id
    ) {
        QuestionResponseRequest question = questionService.getQuestionData(id);
        return ResponseEntity.ok(ApiResponse.success(question));
    }

    @PostMapping("/{id}/views")
    public ResponseEntity<ApiResponse<QuestionResponseRequest>> incrementQuestionViews(
            @PathVariable Long id) {

        QuestionResponseRequest question = questionService.incrementQuestionViews(id);
        return ResponseEntity.ok(ApiResponse.success(question));
    }


    @PatchMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionUpdateRequest request,
            @AuthenticationPrincipal User user
    ) {

        questionService.updateQuestion(questionId, user.getId(), request);

        return ResponseEntity.ok(ApiResponse.success("질문이 수정되었습니다."));
    }


    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable Long questionId,
            @AuthenticationPrincipal User user
    ) {

        questionService.deleteQuestion(questionId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("질문이 삭제되었습니다."));
    }
}

