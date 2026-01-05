package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.domain.User;
import com.example.backend.dto.AnswerCreateRequest;
import com.example.backend.dto.AnswerResponse;
import com.example.backend.dto.AnswerUpdateRequest;
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
		@AuthenticationPrincipal User user,
		@Valid @RequestBody AnswerCreateRequest request
	) {
		answerService.createAnswer(questionId, user.getId(), request);
		return ResponseEntity.ok(ApiResponse.success("답변이 등록되었습니다."));
	}

	@GetMapping("/questions/{questionId}/answers")
	public ResponseEntity<ApiResponse<List<AnswerResponse>>> getAnswers(
		@PathVariable Long questionId
	) {
		List<AnswerResponse> response = answerService.getAnswers(questionId);
		return ResponseEntity.ok(ApiResponse.success("답변 목록 조회 성공", response));
	}

	@PatchMapping("/answers/{answerId}")
	public ResponseEntity<ApiResponse<Void>> updateAnswer(
		@PathVariable("answerId") Long answerId,
		@AuthenticationPrincipal User user,
		@Valid @RequestBody AnswerUpdateRequest request
	) {
		answerService.updateAnswer(answerId, user.getId(), request);
		return ResponseEntity.ok(ApiResponse.success("답변이 수정되었습니다."));
	}

	@DeleteMapping("/answers/{answerId}")
	public ResponseEntity<ApiResponse<Void>> deleteAnswer(
		@AuthenticationPrincipal User user,
		@PathVariable("answerId") Long answerId
	) {
		answerService.deleteAnswer(answerId, user.getId());
		return ResponseEntity.ok(ApiResponse.success("답변이 삭제되었습니다."));
	}

	// 답변 채택
	@PatchMapping("/answers/{answerId}/accept")
	public ResponseEntity<ApiResponse<Void>> acceptAnswer(
		@AuthenticationPrincipal User user,
		@PathVariable("answerId") Long answerId
	) {
		answerService.acceptAnswer(answerId, user.getId());
		return ResponseEntity.ok(ApiResponse.success("답변 채택이 완료되었습니다."));
	}

	// 답변 채택 취소
	@PatchMapping("/answers/{answerId}/unaccept")
	public ResponseEntity<ApiResponse<Void>> unacceptAnswer(
		@AuthenticationPrincipal User user,
		@PathVariable("answerId") Long answerId
	) {
		answerService.unacceptAnswer(answerId, user.getId());
		return ResponseEntity.ok(ApiResponse.success("채택 취소가 완료되었습니다."));
	}
}
