package com.example.backend.repository;

import com.example.backend.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long>, QuestionQueryRepository {
    int countByUserId(Long userId);
}
