package com.example.backend.repository;

import com.example.backend.domain.QLocation;
import com.example.backend.domain.QMeeting;
import com.example.backend.domain.QMeetingMember;
import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingSearchCondition;
import com.example.backend.dto.MyMeetingItemDto;
import com.example.backend.enums.MeetingCategory;
import com.example.backend.enums.MeetingStatus;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class MeetingQueryRepositoryImpl implements MeetingQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<MeetingListResponse> findMeetingList(
            MeetingSearchCondition condition,
            Pageable pageable ) {

        QMeeting meeting = QMeeting.meeting;
        QMeetingMember member = QMeetingMember.meetingMember;
        QLocation location = QLocation.location;

        List<MeetingListResponse> content = queryFactory
                .select(Projections.constructor(
                        MeetingListResponse.class,
                        meeting.id,
                        meeting.title,
                        meeting.description,
                        meeting.category,
                        meeting.status,
                        location.province,
                        location.city,
                        meeting.capacity,
                        member.countDistinct()
                ))
                .from(meeting)
                .join(meeting.location, location)
                .leftJoin(meeting.members, member)
                .where(
                        categoryEq(condition.getCategory()),
                        statusEq(condition.getStatus()),
                        keywordContains(condition.getKeyword()),
                        provinceEq(condition.getProvince()),
                        cityEq(condition.getCity())
                        // townEq(condition.getTown())
                )
                .groupBy(meeting.id, location.id)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(meeting.createdAt.desc())
                .fetch();

        Long total = queryFactory
                .select(meeting.count())
                .from(meeting)
                .join(meeting.location, location)
                .where(
                        categoryEq(condition.getCategory()),
                        statusEq(condition.getStatus()),
                        keywordContains(condition.getKeyword()),
                        provinceEq(condition.getProvince()),
                        cityEq(condition.getCity())
                        // townEq(condition.getTown())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0);
    }

    private BooleanExpression categoryEq(MeetingCategory category) {
        return category != null ? QMeeting.meeting.category.eq(category) : null;
    }

    private BooleanExpression statusEq(MeetingStatus status) {
        return status != null ? QMeeting.meeting.status.eq(status) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return QMeeting.meeting.title.containsIgnoreCase(keyword)
                .or(QMeeting.meeting.description.containsIgnoreCase(keyword));
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

    // private BooleanExpression townEq(String town) {
    //     return (town == null || town.isBlank())
    //             ? null
    //             : QLocation.location.town.eq(town);
    // }


    public List<MyMeetingItemDto> findMyMeetings(
            Long userId,
            Long cursor,
            int size) {
        QMeeting m = QMeeting.meeting;
        QMeetingMember mm = QMeetingMember.meetingMember;
        QMeetingMember mm2 = new QMeetingMember("mm2");

        return queryFactory
                .select(Projections.constructor(
                        MyMeetingItemDto.class,
                        m.id,
                        m.title,
                        m.status,
                        JPAExpressions
                                .select(mm2.count())
                                .from(mm2)
                                .where(mm2.meeting.eq(m)),
                        m.capacity,
                        mm.createdAt
                ))
                .from(mm)
                .join(mm.meeting, m)
                .where(
                        mm.user.id.eq(userId),
                        cursorCondition(cursor, m)
                )
                .orderBy(m.id.desc())
                .limit(size + 1)
                .fetch();
    }

    private BooleanExpression cursorCondition(Long cursor, QMeeting m) {
        if (cursor == null) {
            return null;
        }
        return m.id.lt(cursor);
    }
}