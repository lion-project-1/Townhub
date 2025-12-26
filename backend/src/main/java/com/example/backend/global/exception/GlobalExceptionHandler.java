package com.example.backend.global.exception;


import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.global.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {

        ErrorCode errorCode = e.getErrorCode();
        log.error("CustomException 발생: {}", errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ApiResponse.fail(errorCode.getCode(), errorCode.getMessage()));
    }

}
