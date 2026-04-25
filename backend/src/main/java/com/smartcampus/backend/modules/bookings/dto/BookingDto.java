package com.smartcampus.backend.modules.bookings.dto;

import com.smartcampus.backend.modules.bookings.entity.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingDto {
    private String id;
    private String userId;
    private String userEmail;
    private String resourceId;
    private String resourceName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private BookingStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private String adminNotes;
}
