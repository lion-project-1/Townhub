package com.example.backend.repository;

import com.example.backend.domain.Location;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByEmail(String email);
    Long countUserByLocation(Location location);
}
