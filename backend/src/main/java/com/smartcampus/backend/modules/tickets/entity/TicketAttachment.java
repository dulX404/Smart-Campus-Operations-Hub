package com.smartcampus.backend.modules.tickets.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachment {
    private String originalFileName;
    private String storedFileName;
    private String contentType;
    private String url;
    private long size;
}
