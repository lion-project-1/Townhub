package com.example.backend.domain;

import com.example.backend.enums.MeetingCategory;
import com.example.backend.enums.MeetingStatus;
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
import java.util.ArrayList;
import java.util.List;
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
@Table(name = "meetings")
public class Meeting extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private MeetingCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private String meetingPlace;

    @Column(nullable = false)
    private String schedule;

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MeetingMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MeetingJoinRequest> joinRequest = new ArrayList<>();


    public void update(
            String title,
            String description,
            MeetingCategory category,
            String meetingPlace,
            String schedule,
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

        if (hasText(meetingPlace)) {
            this.meetingPlace = meetingPlace;
        }

        if (hasText(schedule)) {
            this.schedule = schedule;
        }

        if (capacity != null) {
            validateCapacity(capacity);
            this.capacity = capacity;
        }
    }


    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void validateCapacity(Integer capacity) {
        if (capacity < 2 || capacity > 100) {
            throw new CustomException(ErrorCode.INVALID_MEETING_CAPACITY);
        }
    }

}

