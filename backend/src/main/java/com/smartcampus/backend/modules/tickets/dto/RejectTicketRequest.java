package com.smartcampus.backend.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectTicketRequest {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}
