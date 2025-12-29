package com.example.backend.repository;

import com.example.backend.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByProvinceAndCityAndTown(String province, String city, String town);
}


