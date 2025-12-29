package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.domain.Answer;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnswerResponse {

	private Long id;
	private String content;
	private boolean isAccepted;
	private String writer;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static AnswerResponse fromEntity(Answer answer) {
		return AnswerResponse.builder()
			.id(answer.getId())
			.content(answer.getContent())
			.writer(answer.getUser().getNickname())
			.isAccepted(answer.isAccepted())
			.createdAt(answer.getCreatedAt())
			.updatedAt(answer.getUpdatedAt())
			.build();
	}
}
