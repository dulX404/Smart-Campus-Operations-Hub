package com.smartcampus.backend.modules.bookings.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @GetMapping("/placeholder")
    public ApiResponse<String> placeholder() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Bookings module starter endpoint")
                .data("Not implemented")
                .build();
    }
}
