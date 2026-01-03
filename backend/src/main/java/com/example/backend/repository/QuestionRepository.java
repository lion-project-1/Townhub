package com.example.backend.repository;

import com.example.backend.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Modifying
    @Query("update Question q set q.viewCount = q.viewCount + 1 where q.id = :id")
    void increaseViewCount(@Param("id") Long id);
}
