package com.smartcampus.backend.modules.tickets.dto;

import com.smartcampus.backend.modules.tickets.comment.Comment;
import com.smartcampus.backend.modules.tickets.entity.TicketAttachment;
import com.smartcampus.backend.modules.tickets.entity.TicketCategory;
import com.smartcampus.backend.modules.tickets.entity.TicketPriority;
import com.smartcampus.backend.modules.tickets.entity.TicketStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class TicketDto {
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
    private List<TicketAttachment> attachments = new ArrayList<>();
    private TicketStatus status;
    private String assignedToEmail;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private List<Comment> comments = new ArrayList<>();
}
