package com.example.backend.repository;

import com.example.backend.domain.QQuestion;
import com.example.backend.domain.QAnswer;
import com.example.backend.dto.MyQuestionItemDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class QuestionQueryRepositoryImpl implements QuestionQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<MyQuestionItemDto> findMyQuestions(Long userId, Long cursor, int sizePlusOne) {
        QQuestion q = QQuestion.question;

        // answerCount 서브쿼리(리스트는 안 가져옴)
        QAnswer a2 = new QAnswer("a2");

        return queryFactory
                .select(Projections.constructor(
                        MyQuestionItemDto.class,
                        q.id,
                        q.title,
                        q.questionCategory.stringValue(),
                        q.createdAt,
                        JPAExpressions
                                .select(a2.count())
                                .from(a2)
                                .where(a2.question.eq(q))
                ))
                .from(q)
                .where(
                        q.user.id.eq(userId),
                        ltCursor(cursor, q)
                )
                .orderBy(q.id.desc())
                .limit(sizePlusOne)
                .fetch();
    }

    private BooleanExpression ltCursor(Long cursor, QQuestion q) {
        return cursor == null ? null : q.id.lt(cursor);
    }
}
