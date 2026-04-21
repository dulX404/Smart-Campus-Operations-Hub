package com.smartcampus.backend.modules.notifications.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping("/placeholder")
    public ApiResponse<String> placeholder() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Notifications module starter endpoint")
                .data("Not implemented")
                .build();
    }
}
