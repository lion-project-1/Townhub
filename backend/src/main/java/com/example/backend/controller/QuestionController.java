package com.example.backend.controller;

import com.example.backend.domain.DTO.QuestionCreateRequest;
import com.example.backend.domain.DTO.QuestionResponse;
import com.example.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/town/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<Long> create(@RequestBody QuestionCreateRequest request) {
        Long questionId = questionService.createQuestion(1L, request);
        return ResponseEntity.ok(questionId);
    }

    @GetMapping
    public List<QuestionResponse> list() {
        return questionService.getQuestions();
    }

    @GetMapping("/{id}")
    public QuestionResponse detail(@PathVariable Long id) {
        return questionService.getQuestion(id);
    }
}

