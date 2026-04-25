package com.smartcampus.backend.modules.notifications.service;

import com.smartcampus.backend.modules.notifications.entity.Notification;
import com.smartcampus.backend.modules.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repository;

    public List<Notification> getNotificationsForUser(String role, String userId) {
        List<Notification> roleNotifications = repository.findByTargetRoleInAndScheduledAtBeforeOrderByCreatedAtDesc(
            Arrays.asList(role, "ALL"), 
            LocalDateTime.now()
        );
        List<Notification> userNotifications = repository.findByUserIdAndScheduledAtBeforeOrderByCreatedAtDesc(
            userId,
            LocalDateTime.now()
        );

        return Stream.concat(roleNotifications.stream(), userNotifications.stream())
                .sorted((a, b) -> {
                    LocalDateTime aTime = a.getScheduledAt() != null ? a.getScheduledAt() : a.getCreatedAt();
                    LocalDateTime bTime = b.getScheduledAt() != null ? b.getScheduledAt() : b.getCreatedAt();
                    return bTime.compareTo(aTime);
                })
                .distinct()
                .toList();
    }

    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    public Notification createNotification(Notification notification, String adminEmail) {
        notification.setCreatedBy(adminEmail);
        notification.setCreatedAt(LocalDateTime.now());
        if (notification.getScheduledAt() == null) {
            notification.setScheduledAt(LocalDateTime.now());
        }
        return repository.save(notification);
    }

    public Notification createUserNotification(String title, String message, String userId, String targetRole) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .userId(userId)
                .targetRole(targetRole)
                .createdBy("SYSTEM")
                .createdAt(LocalDateTime.now())
                .scheduledAt(LocalDateTime.now())
                .build();
        return repository.save(notification);
    }

    public Notification updateNotification(String id, Notification details) {
        Notification existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        existing.setTitle(details.getTitle());
        existing.setMessage(details.getMessage());
        existing.setTargetRole(details.getTargetRole());
        existing.setScheduledAt(details.getScheduledAt());
        return repository.save(existing);
    }

    public void deleteNotification(String id) {
        repository.deleteById(id);
    }
}
