package com.example.backend.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "events")
public class Event extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(length = 1000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EventCategory category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "location_id", nullable = false)
	private Location location;

	@Column(nullable = false)
	private String eventPlace;

	/** 시작 일시 (프론트: 날짜+시간 피커 -> LocalDateTime) */
	@Column(nullable = false)
	private LocalDateTime startAt;

	@Column(nullable = false)
	private int capacity;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EventStatus status;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "host_id", nullable = false)
	private User host;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EventMember> members = new ArrayList<>();

	public void update(
		String title,
		String description,
		EventCategory category,
		String eventPlace,
		LocalDateTime startAt,
		Integer capacity) {

		if (hasText(title)) {
			this.title = title;
		}

		if (description != null) {
			this.description = description;
		}

		if (category != null) {
			this.category = category;
		}

		if (hasText(eventPlace)) {
			this.eventPlace = eventPlace;
		}

		if (startAt != null) {
			validateStartAt(startAt);
			this.startAt = startAt;
		}

		if (capacity != null) {
			validateCapacity(capacity);
			this.capacity = capacity;
		}
	}

	private boolean hasText(String value) {
		return value != null && !value.isBlank();
	}

	private void validateStartAt(LocalDateTime startAt) {
		if (!startAt.isAfter(LocalDateTime.now())) {
			throw new CustomException(ErrorCode.INVALID_EVENT_START_AT);
		}
	}

	private void validateCapacity(Integer capacity) {
		if (capacity < 2 || capacity > 100) {
			throw new CustomException(ErrorCode.INVALID_EVENT_CAPACITY);
		}
	}

}
