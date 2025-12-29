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

    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
