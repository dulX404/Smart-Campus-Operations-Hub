package com.smartcampus.backend.modules.notifications.controller;

import com.smartcampus.backend.modules.notifications.entity.Notification;
import com.smartcampus.backend.modules.notifications.service.NotificationService;
import com.smartcampus.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        
        // If Admin, show EVERYTHING (including future scheduled ones)
        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(ApiResponse.success("All notifications fetched", service.getAllNotifications()));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", service.getNotificationsForUser(role)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Notification>> create(@RequestBody Notification notification, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Notification created", service.createNotification(notification, authentication.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Notification>> update(@PathVariable String id, @RequestBody Notification notification) {
        return ResponseEntity.ok(ApiResponse.success("Notification updated", service.updateNotification(id, notification)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }
}
