package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.domain.Answer;
import org.springframework.data.repository.query.Param;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
	@Query("""
			select a
			from Answer a
			join fetch a.user
			where a.question.id = :questionId
			order by a.isAccepted desc, a.createdAt desc
		""")
	List<Answer> findAllByQuestionIdWithUser(Long questionId);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("delete from Answer a where a.question.id = :questionId")
	void deleteByQuestionId(@Param("questionId") Long questionId);

}
