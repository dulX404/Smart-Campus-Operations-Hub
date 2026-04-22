package com.smartcampus.backend.modules.notifications.entity;

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
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String title;
    private String message;
    private String targetRole; // ROLE_ADMIN, ROLE_STUDENT, or ALL
    private String createdBy; // Admin email
    private LocalDateTime createdAt;
    private LocalDateTime scheduledAt;
}
