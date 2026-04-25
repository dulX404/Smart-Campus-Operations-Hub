package com.smartcampus.backend.modules.bookings.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String userId;
    private String userEmail;
    private String resourceId;
    private String resourceName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;

    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private String adminNotes;
}
