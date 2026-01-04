package com.example.backend.repository;

import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long>, QuestionQueryRepository {
    int countByUserId(Long userId);
    void deleteByUser(User user);
}
