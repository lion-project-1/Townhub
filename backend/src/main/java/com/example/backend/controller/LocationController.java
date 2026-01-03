package com.example.backend.controller;

import com.example.backend.domain.Location;
import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.dto.MeetingCreateResponse;
import com.example.backend.dto.MeetingDetailResponse;
import com.example.backend.dto.MeetingListResponse;
import com.example.backend.dto.MeetingSearchCondition;
import com.example.backend.dto.MeetingUpdateRequest;
import com.example.backend.enums.MeetingStatus;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.LocationService;
import com.example.backend.service.MeetingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Location>>> getMeetingList(@RequestParam("keyword") String keyword) {

        List<Location> locationList = locationService.getLocationList(keyword);
        return ResponseEntity.ok(ApiResponse.success(locationList));
    }
}
