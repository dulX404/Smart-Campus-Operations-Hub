package com.smartcampus.backend.modules.notifications.repository;

import com.smartcampus.backend.modules.notifications.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByTargetRoleInOrderByCreatedAtDesc(List<String> targetRoles);
    
    List<Notification> findByTargetRoleInAndScheduledAtBeforeOrderByCreatedAtDesc(List<String> targetRoles, LocalDateTime now);
}
