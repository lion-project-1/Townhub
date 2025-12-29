package com.example.backend.global.exception.custom;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // USER
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "USER_001", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "USER_002", "이미 사용 중인 닉네임입니다."),
    INVALID_LOGIN(HttpStatus.UNAUTHORIZED, "AUTH_001", "이메일 또는 비밀번호가 올바르지 않습니다."),

    // QUESTION
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-001", "서버 내부 오류가 발생했습니다."),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "QUESTION-001", "존재하지 않는 질문입니다."),
    QUESTION_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "QUESTION_UPDATE_FORBIDDEN", "질문 수정 권한이 없습니다."),

	// Location
	LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND, "LOCATION-001", "해당 지역이 존재하지 않습니다."),

	// Meeting
	INVALID_MEETING_CAPACITY(HttpStatus.BAD_REQUEST, "MEETING-001", "모임의 인원 범위는 2~100명 사이입니다."),
	MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "MEETING-002", "해당 모임이 존재하지 않습니다."),
	MEETING_MEMBER_FORBIDDEN(HttpStatus.FORBIDDEN, "MEETING-003", "모임 멤버만 접근할 수 있습니다."),
	MEETING_HOST_ONLY(HttpStatus.FORBIDDEN, "MEETING-004", "방장만 접근할 수 있습니다."),

	;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
