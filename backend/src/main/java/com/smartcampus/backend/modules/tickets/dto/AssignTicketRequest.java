package com.smartcampus.backend.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignTicketRequest {
    @NotBlank(message = "Assigned email is required")
    private String assignedToEmail;
}
