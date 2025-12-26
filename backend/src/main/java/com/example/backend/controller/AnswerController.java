package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AnswerCreateRequest;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.AnswerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AnswerController {
	private final AnswerService answerService;

	@PostMapping("/questions/{questionId}/answers")
	public ResponseEntity<ApiResponse<Void>> createAnswer(
		@PathVariable("questionId") Long questionId,
		// @AuthenticationPrincipal Long userId,
		@Valid @RequestBody AnswerCreateRequest request
	) {
		Long tmpUserId = 1L;
		answerService.createAnswer(questionId, tmpUserId, request);
		return ResponseEntity.ok(ApiResponse.success("답변이 등록되었습니다."));
	}
}
