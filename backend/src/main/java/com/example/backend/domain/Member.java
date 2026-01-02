package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nickname;

    private String profileImage;

    @Column(length = 500)
    private String introduction;

    @Column(nullable = false)
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    public Member(String email, String nickname) {
        this.email = email;
        this.nickname = nickname;
    }

    public void updateProfile(String nickname, String profileImage, String introduction) {
        if (nickname != null && !nickname.isBlank()) {
            this.nickname = nickname;
        }
        this.profileImage = profileImage;
        this.introduction = introduction;
    }
    public void withdraw() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }
    public void softDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }

}
