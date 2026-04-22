package com.smartcampus.backend.modules.notifications.service;

import com.smartcampus.backend.modules.notifications.entity.Notification;
import com.smartcampus.backend.modules.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repository;

    public List<Notification> getNotificationsForUser(String role) {
        return repository.findByTargetRoleInAndScheduledAtBeforeOrderByCreatedAtDesc(
            Arrays.asList(role, "ALL"), 
            LocalDateTime.now()
        );
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
