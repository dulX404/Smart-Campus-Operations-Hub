package com.smartcampus.backend.modules.tickets.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String createdByEmail;
    private String resourceId;
    private String resourceName;
    private String location;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
    @Builder.Default
    private List<TicketAttachment> attachments = new ArrayList<>();
    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;
    private String assignedToEmail;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
}
