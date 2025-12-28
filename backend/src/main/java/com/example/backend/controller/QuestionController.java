package com.example.backend.controller;

import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

