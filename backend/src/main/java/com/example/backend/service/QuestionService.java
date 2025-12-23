package com.example.backend.service;

import com.example.backend.domain.DTO.QuestionCreateRequest;
import com.example.backend.domain.DTO.QuestionResponse;
import com.example.backend.domain.QuestionEntity;
import com.example.backend.domain.UserEntity;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public QuestionService(QuestionRepository questionRepository,
                           UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    // 질문 등록
    public Long createQuestion(Long userId, QuestionCreateRequest request) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));

        QuestionEntity question = new QuestionEntity(
                request.getTitle(),
                request.getContent(),
                user
        );

        QuestionEntity saved = questionRepository.save(question);
        return saved.getId();
    }


     // 질문 목록 조회
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestions() {

        return questionRepository.findAll()
                .stream()
                .map(QuestionResponse::new)
                .toList();
    }


    // 질문 상세 조회
    @Transactional(readOnly = true)
    public QuestionResponse getQuestion(Long questionId) {

        QuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("질문이 존재하지 않음"));

        return new QuestionResponse(question);
    }
}
