package com.vento.controller;

import com.vento.entity.Notification;
import com.vento.entity.User;
import com.vento.service.AuthService;
import com.vento.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "In-app notification management")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get all notifications for current user")
    public ResponseEntity<List<Notification>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }

    @PatchMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        notificationService.markAllRead(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        notificationService.markRead(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
