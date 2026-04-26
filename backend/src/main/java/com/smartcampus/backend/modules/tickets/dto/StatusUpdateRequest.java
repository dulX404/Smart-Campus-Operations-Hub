package com.smartcampus.backend.modules.tickets.dto;

import com.smartcampus.backend.modules.tickets.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;
    private String resolutionNotes;
}
