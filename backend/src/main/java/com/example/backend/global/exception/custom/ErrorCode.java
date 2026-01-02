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
	INVALID_LOGIN(HttpStatus.UNAUTHORIZED, "AUTH_001", "이메일 또는 비밀번호가 올바르지 않습니다."),
	ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH_002", "접근 권한이 없습니다."),

	// USER
	DUPLICATE_EMAIL(HttpStatus.CONFLICT, "USER_001", "이미 사용 중인 이메일입니다."),
	DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "USER_002", "이미 사용 중인 닉네임입니다."),
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_003", "존재하지 않는 사용자입니다."),

	// TOKEN
	TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN_001", "토큰이 만료되었습니다."),
	TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "TOKEN_002", "유효하지 않은 토큰입니다."),
	TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "TOKEN_003", "토큰이 존재하지 않습니다."),
	TOKEN_INTERNAL(HttpStatus.UNAUTHORIZED, "TOKEN_004", "토큰 필터 내부 문제"), // test 용
	MASTER_USER_ID_NOT_FOUND(HttpStatus.UNAUTHORIZED, "TOKEN_005", "해당 유저 ID 가 없음"), // 에러 시, 환경변수 확인

	// QUESTION
	QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "QUESTION-001", "존재하지 않는 질문입니다."),
	QUESTION_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "QUESTION_UPDATE_FORBIDDEN", "질문 수정 권한이 없습니다."),
	QUESTION_ALREADY_ACCEPTED(HttpStatus.CONFLICT, "QUESTION_ALREADY_ACCEPTED", "해당 질문에는 이미 채택된 답변이 존재합니다."),

	// ANSWER
	ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "ANSWER-001", "존재하지 않는 답변입니다."),
	ANSWER_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_UPDATE_FORBIDDEN", "답변 수정 권한이 없습니다."),
	ANSWER_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_DELETE_FORBIDDEN", "답변 삭제 권한이 없습니다."),
	ANSWER_ACCEPT_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_ACCEPT_FORBIDDEN", "답변 채택 권한이 없습니다."),
	ANSWER_ALREADY_ACCEPTED(HttpStatus.BAD_REQUEST, "ANSWER_ALREADY_ACCEPTED", "이미 채택된 답변입니다."),

    // ANSWER
    ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "ANSWER-001", "존재하지 않는 답변입니다."),
    ANSWER_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_UPDATE_FORBIDDEN", "답변 수정 권한이 없습니다."),
    ANSWER_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "ANSWER_DELETE_FORBIDDEN", "답변 삭제 권한이 없습니다."),

	
	// Location
	LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND, "LOCATION-001", "해당 지역이 존재하지 않습니다."),

	// Meeting
	INVALID_MEETING_CAPACITY(HttpStatus.BAD_REQUEST, "MEETING-001", "모임의 인원 범위는 2~100명 사이입니다."),
	MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "MEETING-002", "해당 모임이 존재하지 않습니다."),
	MEETING_MEMBER_FORBIDDEN(HttpStatus.FORBIDDEN, "MEETING-003", "모임 멤버만 접근할 수 있습니다."),
	MEETING_HOST_ONLY(HttpStatus.FORBIDDEN, "MEETING-004", "방장만 접근할 수 있습니다."),

    // MYPAGE
    MYPAGE_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MYPAGE-001", "회원이 없습니다."),
    MYPAGE_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "MYPAGE-002", "인증 정보가 없습니다."),


    ;

	private final HttpStatus status;
	private final String code;
	private final String message;
}
