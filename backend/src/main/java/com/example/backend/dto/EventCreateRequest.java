package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.enums.EventCategory;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCreateRequest {
	@NotBlank(message = "이벤트 제목은 필수입니다.")
	private String title;

	private String description;

	@NotNull(message = "이벤트 카테고리는 필수입니다.")
	private EventCategory category;

	@NotNull
	private Long locationId;

	@NotBlank
	private String eventPlace;

	@NotNull(message = "이벤트 날짜는 필수입니다.")
	@Future(message = "이벤트 날짜는 미래 시간이어야 합니다.")
	private LocalDateTime startAt;

	@Min(2)
	@Max(100)
	private int capacity;
}
