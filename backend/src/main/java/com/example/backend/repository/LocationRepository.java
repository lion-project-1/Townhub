package com.example.backend.repository;

import com.example.backend.domain.Answer;
import com.example.backend.domain.Location;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByProvinceAndCity(String province, String city);

    @Query("select distinct l "
            + "from Location l "
            + "where l.city like %:keyword%"
)
    List<Location> findAllByKeyword(@Param("keyword") String keyword);

}



