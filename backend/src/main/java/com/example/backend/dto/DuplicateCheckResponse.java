package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DuplicateCheckResponse {
    // true: 사용 가능(중복 아님), false: 중복
    private boolean available;
}


