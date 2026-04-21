package com.smartcampus.backend.modules.tickets.dto;

import lombok.Data;

@Data
public class TicketDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String status;
}
