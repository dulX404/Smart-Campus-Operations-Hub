package com.smartcampus.backend.modules.auth.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/placeholder")
    public ApiResponse<String> placeholder() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Auth module starter endpoint")
                .data("Not implemented")
                .build();
    }
}
