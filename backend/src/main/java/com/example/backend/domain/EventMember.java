package com.example.backend.domain;

import com.example.backend.enums.ParticipantRole;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(
	name = "event_members",
	uniqueConstraints = {
		@UniqueConstraint(columnNames = {"event_id", "user_id"})
	}
)
public class EventMember extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "event_id", nullable = false)
	private Event event;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ParticipantRole role;

	protected EventMember(Event event, User user, ParticipantRole role) {
		this.event = event;
		this.user = user;
		this.role = role;
	}

	public static EventMember createHost(Event event, User user) {
		return new EventMember(event, user, ParticipantRole.HOST);
	}

	public static EventMember createMember(Event event, User user) {
		return new EventMember(event, user, ParticipantRole.MEMBER);
	}
}
