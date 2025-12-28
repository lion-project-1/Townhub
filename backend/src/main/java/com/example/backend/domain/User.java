package com.example.backend.domain;

import com.example.backend.enums.UserRole;
import jakarta.persistence.*;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Builder
    public User(String email, String password, String nickname, UserRole role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
    }
}

//@Getter
//@Setter
//@Entity
//@Table(name = "users")
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class User extends BaseEntity{
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String email;
//    private String password;
//
//    @Column(nullable = false, unique = true)
//    private String nickname;
//
//    @ManyToOne(fetch= FetchType.LAZY)
//    @JoinColumn(name = "location_id")
//    private Location location;
//}
