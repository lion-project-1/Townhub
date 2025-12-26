package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
	public Optional<Answer> findByIdAndQuestionId(Long answerId, Long questionId);
}
