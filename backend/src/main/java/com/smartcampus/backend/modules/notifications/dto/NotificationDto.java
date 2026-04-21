package com.smartcampus.backend.modules.notifications.dto;

import lombok.Data;

@Data
public class NotificationDto {
    private String id;
    private String userId;
    private String title;
    private String message;
    private Boolean read;
}
