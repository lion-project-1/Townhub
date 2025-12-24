package com.example.backend.domain;

import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.enums.QuestionCategory;
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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "questions")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 3000)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_category", nullable = false)
    private QuestionCategory questionCategory;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void update(QuestionCategory category, String title, String content) {
        if (category != null) {
            this.questionCategory = category;
        }

        if (hasText(title)) {
            this.title = title;
        }

        if (hasText(content)) {
            this.content = content;
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
