package com.smartcampus.backend.modules.bookings.dto;

import lombok.Data;

@Data
public class BookingDto {
    private String id;
    private String userId;
    private String resourceId;
    private String startTime;
    private String endTime;
    private String status;
}
