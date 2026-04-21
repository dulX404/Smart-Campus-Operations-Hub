package com.smartcampus.backend.modules.tickets.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @GetMapping("/placeholder")
    public ApiResponse<String> placeholder() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Tickets module starter endpoint")
                .data("Not implemented")
                .build();
    }
}
