package com.example.backend.global.exception;


import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {

        ErrorCode errorCode = e.getErrorCode();
        log.error("CustomException 발생: {}", errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ErrorResponse.of(errorCode));
    }

    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private int status;
        private String code;
        private String message;
        public static ErrorResponse of(ErrorCode errorCode) {
            return new ErrorResponse(
                    errorCode.getStatus().value(),
                    errorCode.getCode(),
                    errorCode.getMessage());
        }
    }
}
