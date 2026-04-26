package com.smartcampus.backend.modules.tickets.dto;

import com.smartcampus.backend.modules.tickets.entity.TicketCategory;
import com.smartcampus.backend.modules.tickets.entity.TicketPriority;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private String resourceId;
    private String location;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
}
