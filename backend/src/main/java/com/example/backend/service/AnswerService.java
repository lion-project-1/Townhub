package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.domain.Answer;
import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import com.example.backend.dto.AnswerCreateRequest;
import com.example.backend.dto.AnswerResponse;
import com.example.backend.dto.AnswerUpdateRequest;
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

	public List<AnswerResponse> getAnswers(Long questionId) {
		if (!questionRepository.existsById(questionId)) {
			throw new CustomException(ErrorCode.QUESTION_NOT_FOUND);
		}

		return answerRepository.findAllByQuestionIdWithUser(questionId)
			.stream()
			.map(AnswerResponse::fromEntity)
			.toList();
	}

	@Transactional
	public void updateAnswer(Long answerId, Long userId, AnswerUpdateRequest request) {
		Answer answer = answerRepository.findById(answerId)
			.orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

		if (!answer.getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.ANSWER_UPDATE_FORBIDDEN);
		}

		answer.update(request.getContent());
	}

	@Transactional
	public void deleteAnswer(Long answerId, Long userId) {
		Answer answer = answerRepository.findById(answerId)
			.orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

		if (!answer.getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.ANSWER_DELETE_FORBIDDEN);
		}

		answerRepository.delete(answer);
	}

	@Transactional
	public void acceptAnswer(Long answerId, Long userId) {
		Answer answer = answerRepository.findById(answerId)
			.orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

		if (!answer.getQuestion().getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.ANSWER_ACCEPT_FORBIDDEN);
		}

		Long questionId = answer.getQuestion().getId();

		if (answer.isAccepted()) {
			return;
		}

		answerRepository.findByQuestionIdAndIsAcceptedTrue(questionId)
			.ifPresent(Answer::unaccept);

		answer.accept();
	}

	@Transactional
	public void unacceptAnswer(Long answerId, Long userId) {
		Answer answer = answerRepository.findById(answerId)
			.orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

		if (!answer.getQuestion().getUser().getId().equals(userId)) {
			throw new CustomException(ErrorCode.ANSWER_ACCEPT_FORBIDDEN);
		}

		if (!answer.isAccepted()) {
			return;
		}

		answer.unaccept();
	}
}