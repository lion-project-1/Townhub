package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.TownDashboardResponse;
import com.example.backend.global.response.ApiResponse;
import com.example.backend.service.TownDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/towns")
public class TownDashboardController {

    private final TownDashboardService townDashboardService;

    @GetMapping("/{townId}/dashboard")
    public ApiResponse<TownDashboardResponse> getDashboard(
            @PathVariable Long townId) {
        return ApiResponse.success(
                townDashboardService.getDashboard(townId)
        );
    }
}