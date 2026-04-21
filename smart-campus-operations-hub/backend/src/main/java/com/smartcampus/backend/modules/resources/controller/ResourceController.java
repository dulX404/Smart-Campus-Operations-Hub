package com.smartcampus.backend.modules.resources.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @GetMapping("/placeholder")
    public ApiResponse<String> placeholder() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Resources module starter endpoint")
                .data("Not implemented")
                .build();
    }
}
