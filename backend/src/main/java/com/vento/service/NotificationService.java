package com.vento.service;

import com.vento.entity.Notification;
import com.vento.entity.User;
import com.vento.exception.ResourceNotFoundException;
import com.vento.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Notification service for in-app alerts.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Create a notification (async to avoid blocking the main flow).
     */
    @Async
    @Transactional
    public void notify(User user, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void markRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new com.vento.exception.UnauthorizedException("Not authorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
}
