package com.example.backend.global.exception.custom;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	// COMMON
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-001", "서버 내부 오류가 발생했습니다."),
	INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "COMMON-002", "요청 값이 올바르지 않습니다."),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON-003", "지원하지 않는 HTTP 메서드입니다."),
	INVALID_JSON_FORMAT(HttpStatus.BAD_REQUEST, "COMMON-004", "요청 본문(JSON) 형식이 올바르지 않습니다."),

	// AUTH
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH-001", "인증이 필요합니다."),
	INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-002", "유효하지 않은 토큰입니다."),
	EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-003", "만료된 토큰입니다."),
	ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH-004", "접근 권한이 없습니다."),

	// QUESTION
	QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "QUESTION-001", "존재하지 않는 질문입니다."),
	QUESTION_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "QUESTION_UPDATE_FORBIDDEN", "질문 수정 권한이 없습니다."),

	// USER
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."),

	// ANSWER
	ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "ANSWER-001", "존재하지 않는 답변입니다."),
	ANSWER_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_UPDATE_FORBIDDEN", "답변 수정 권한이 없습니다."),
	ANSWER_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_DELETE_FORBIDDEN", "답변 삭제 권한이 없습니다."),

	;

	private final HttpStatus status;
	private final String code;
	private final String message;
}
