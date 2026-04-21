package com.smartcampus.backend.modules.notifications.repository;

import com.smartcampus.backend.modules.notifications.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification, String> {
}
