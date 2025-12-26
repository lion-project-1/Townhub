package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
