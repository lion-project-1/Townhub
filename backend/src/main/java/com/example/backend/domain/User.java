package com.example.backend.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<MeetingMember> meetingMembers = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Answer> answers = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();


    @Builder
    public User(String email, String password, String nickname, Location location) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.location = location;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void changeLocation(Location location) {
        this.location = location;
    }
}