package com.example.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.example.backend.domain.QEvent;
import com.example.backend.domain.QEventMember;
import com.example.backend.domain.QLocation;
import com.example.backend.dto.EventListResponse;
import com.example.backend.dto.EventSearchCondition;
import com.example.backend.dto.FlashEventListResponse;
import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class EventQueryRepositoryImpl implements EventQueryRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<EventListResponse> findEventList(
		EventSearchCondition condition,
		Pageable pageable) {

		QEvent event = QEvent.event;
		QEventMember member = QEventMember.eventMember;
		QLocation location = QLocation.location;

		List<EventListResponse> content = queryFactory
			.select(Projections.constructor(
				EventListResponse.class,
				event.id,
				event.title,
				event.description,
				event.category,
				event.status,
				event.eventPlace,
				event.startAt,
				event.createdAt,
				location.province,
				location.city,
				event.capacity,
				member.countDistinct()
			))
			.from(event)
			.join(event.location, location)
			.leftJoin(event.members, member)
			.where(
				event.category.ne(EventCategory.FLASH),
				categoryEq(condition.getCategory()),
				statusEq(condition.getStatus()),
				keywordContains(condition.getKeyword()),
				provinceEq(condition.getProvince()),
				cityEq(condition.getCity())
			)
			.groupBy(event.id, location.id)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(event.createdAt.desc())
			.fetch();

		Long total = queryFactory
			.select(event.id.countDistinct())
			.from(event)
			.join(event.location, location)
			.where(
				event.category.ne(EventCategory.FLASH),
				categoryEq(condition.getCategory()),
				statusEq(condition.getStatus()),
				keywordContains(condition.getKeyword()),
				provinceEq(condition.getProvince()),
				cityEq(condition.getCity())
			)
			.fetchOne();

		return new PageImpl<>(content, pageable, total != null ? total : 0);
	}

	@Override
	public Page<FlashEventListResponse> findFlashEventList(EventSearchCondition condition, Pageable pageable) {
		QEvent event = QEvent.event;
		QEventMember member = QEventMember.eventMember;
		QLocation location = QLocation.location;
		LocalDateTime now = LocalDateTime.now();

		List<FlashEventListResponse> content = queryFactory
			.select(Projections.constructor(
				FlashEventListResponse.class,
				event.id,
				event.title,
				event.description,
				event.status,
				event.eventPlace,
				event.startAt,
				event.createdAt,
				location.province,
				location.city,
				event.capacity,
				member.countDistinct()
			))
			.from(event)
			.join(event.location, location)
			.leftJoin(event.members, member)
			.where(
				event.category.eq(EventCategory.FLASH),
				event.status.eq(EventStatus.RECRUITING),
				keywordContains(condition.getKeyword()),
				provinceEq(condition.getProvince()),
				cityEq(condition.getCity()),
				event.startAt.after(now)
			)
			.groupBy(event.id, location.id)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(event.startAt.asc())
			.fetch();

		Long total = queryFactory
			.select(event.id.countDistinct())
			.from(event)
			.join(event.location, location)
			.where(
				event.category.eq(EventCategory.FLASH),
				event.status.eq(EventStatus.RECRUITING),
				keywordContains(condition.getKeyword()),
				provinceEq(condition.getProvince()),
				cityEq(condition.getCity()),
				event.startAt.after(now)
			)
			.fetchOne();

		return new PageImpl<>(content, pageable, total != null ? total : 0);
	}

	private BooleanExpression categoryEq(EventCategory category) {
		return category != null ? QEvent.event.category.eq(category) : null;
	}

	private BooleanExpression statusEq(EventStatus status) {
		return status != null ? QEvent.event.status.eq(status) : null;
	}

	private BooleanExpression keywordContains(String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return null;
		}

		return QEvent.event.title.containsIgnoreCase(keyword)
			.or(QEvent.event.description.containsIgnoreCase(keyword));
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
}
