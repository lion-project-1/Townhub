package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.domain.Answer;
import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import com.example.backend.dto.AnswerCreateRequest;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.AnswerRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {
	private final QuestionRepository questionRepository;
	private final UserRepository userRepository;
	private final AnswerRepository answerRepository;

	@Transactional
	public void createAnswer(Long questionId, Long userId, AnswerCreateRequest request) {
		Question question = questionRepository.findById(questionId)
			.orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		Answer answer = Answer.builder()
			.content(request.getContent())
			.question(question)
			.user(user)
			.build();

		answerRepository.save(answer);
	}
}