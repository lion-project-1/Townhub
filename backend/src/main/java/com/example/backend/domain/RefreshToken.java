package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @Builder
    public RefreshToken(String token, Long userId, LocalDateTime expiredAt) {
        this.token = token;
        this.userId = userId;
        this.expiredAt = expiredAt;
    }

    public boolean isExpired() {
        return expiredAt.isBefore(LocalDateTime.now());
    }
}