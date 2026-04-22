package com.smartcampus.backend.modules.tickets.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<String> createTicket() {
        return ApiResponse.success("Ticket Creation Access Granted", "New Ticket ID: 123");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteTicket(@PathVariable String id) {
        return ApiResponse.success("Ticket Deletion Access Granted", "Ticket " + id + " Deleted");
    }
}
