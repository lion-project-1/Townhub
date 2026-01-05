package com.example.backend.repository;

import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import com.example.backend.enums.QuestionCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long>, QuestionQueryRepository {
    int countByUserId(Long userId);
    void deleteByUser(User user);

    @Modifying
    @Query("update Question q set q.viewCount = q.viewCount + 1 where q.id = :id")
    void increaseViewCount(@Param("id") Long id);

    Page<Question> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Question> findByQuestionCategory(QuestionCategory category, Pageable pageable);

    Page<Question> findByTitleContainingIgnoreCaseAndQuestionCategory(String title, QuestionCategory category, Pageable pageable);
}
