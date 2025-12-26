package com.example.backend.global.exception.custom;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-001", "서버 내부 오류가 발생했습니다."),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "QUESTION-001", "존재하지 않는 질문입니다."),
    QUESTION_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "QUESTION_UPDATE_FORBIDDEN", "질문 수정 권한이 없습니다."),

    ;

    private final HttpStatus status;
    private final String code;
    private final String message;
}
