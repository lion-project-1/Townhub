package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PopularMeetingDto {
    private Long id;
    private String name;
    private String category;
    private int members;
    private int maxMembers;
}