package com.example.backend.service;

import com.example.backend.domain.Location;
import com.example.backend.repository.LocationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository locationRepository;

    public List<Location> getLocationList(String keyword) {
        return locationRepository.findAllByKeyword(keyword);
    }
}