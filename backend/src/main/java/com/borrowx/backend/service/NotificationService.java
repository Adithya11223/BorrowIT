package com.borrowx.backend.service;

import com.borrowx.backend.entity.Notification;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.NotificationRepository;
import com.borrowx.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<Notification> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
    }

    public List<Notification> markAllRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Notification> list = notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
        for (Notification n : list) {
            if (!n.getRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
        return list;
    }

    public void clearAll(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Notification> list = notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
        notificationRepository.deleteAll(list);
    }

    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
