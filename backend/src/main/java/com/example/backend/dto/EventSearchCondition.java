package com.example.backend.dto;

import com.example.backend.enums.EventCategory;
import com.example.backend.enums.EventStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventSearchCondition {

	private EventCategory category;
	private EventStatus status;
	private String keyword;

	private String province;
	private String city;

}