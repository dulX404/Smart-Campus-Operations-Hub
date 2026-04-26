package com.smartcampus.backend.modules.tickets.dto;

import com.smartcampus.backend.modules.tickets.entity.TicketCategory;
import com.smartcampus.backend.modules.tickets.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {
    private String resourceId;
    private String location;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
}
