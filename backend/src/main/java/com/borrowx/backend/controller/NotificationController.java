package com.borrowx.backend.controller;

import com.borrowx.backend.entity.Notification;
import com.borrowx.backend.service.JwtService;
import com.borrowx.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;

    public NotificationController(NotificationService notificationService,
                                  JwtService jwtService) {
        this.notificationService = notificationService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<Notification> getNotifications(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        return notificationService.getNotifications(email);
    }

    @PutMapping("/read")
    public List<Notification> markAllAsRead(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        return notificationService.markAllRead(email);
    }

    @DeleteMapping
    public String clearNotifications(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        notificationService.clearAll(email);
        return "Notifications cleared successfully!";
    }
}
