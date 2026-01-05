package com.example.backend.repository;

import com.example.backend.domain.QLocation;
import com.example.backend.domain.QQuestion;
import com.example.backend.domain.QAnswer;
import com.example.backend.domain.Question;
import com.example.backend.dto.MyQuestionItemDto;
import com.example.backend.dto.QuestionSearchRequest;
import com.example.backend.enums.QuestionCategory;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
    @Override
    public Page<Question> search(
            QuestionSearchRequest request,
            Pageable pageable
    ) {
        QQuestion q = QQuestion.question;
        QLocation l = QLocation.location;

        boolean isPopular =
                pageable.getSort().isSorted()
                        && pageable.getSort().iterator().next().getProperty().equals("viewCount");

        List<Question> content = queryFactory
                .selectFrom(q)
                .join(q.location, l)
                .where(
                        titleContains(request.getSearch()),
                        categoryEq(request.getCategory()),
                        provinceEq(request.getProvince()),
                        cityEq(request.getCity())
                )
                .orderBy(
                        isPopular
                                ? q.viewCount.desc()   // 인기순 → 이것만
                                : q.createdAt.desc()   // 최신순 → 이것만
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .join(q.location, l)
                .where(
                        titleContains(request.getSearch()),
                        categoryEq(request.getCategory()),
                        provinceEq(request.getProvince()),
                        cityEq(request.getCity())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    /* ===== 조건 메서드 ===== */

    private BooleanExpression titleContains(String search) {
        return (search == null || search.isBlank())
                ? null
                : QQuestion.question.title.containsIgnoreCase(search);
    }

    private BooleanExpression categoryEq(String category) {
        if (category == null || category.isBlank()) return null;
        try {
            return QQuestion.question.questionCategory.eq(
                    QuestionCategory.valueOf(category.toUpperCase())
            );
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private BooleanExpression provinceEq(String province) {
        return (province == null || province.isBlank())
                ? null
                : QLocation.location.province.eq(province);
    }

    private BooleanExpression cityEq(String city) {
        return (city == null || city.isBlank())
                ? null
                : QLocation.location.city.eq(city);
    }

    private BooleanExpression ltCursor(Long cursor, QQuestion q) {
        return cursor == null ? null : q.id.lt(cursor);
    }
}
