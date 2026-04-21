package com.smartcampus.backend.common;

import com.smartcampus.backend.response.ApiResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ApiResponse<Map<String, String>> health() {
        return ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("Application is running")
                .data(Map.of("status", "UP"))
                .build();
    }
}
