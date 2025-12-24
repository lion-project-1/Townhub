package com.example.backend.service;


import com.example.backend.domain.Question;
import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {
    private final QuestionRepository questionRepository;

    @Transactional
    public void updateQuestion(Long questionId, Long loginUserId, QuestionUpdateRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // if (!question.getUser().getId().equals(loginUserId)) {
        //     throw new CustomException(ErrorCode.QUESTION_UPDATE_FORBIDDEN);
        // }

        question.update(request.getQuestionCategory(), request.getTitle(), request.getContent());
    }

}
