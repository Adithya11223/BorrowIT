package com.borrowx.backend.controller;

import com.borrowx.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class SupportController {

    private final EmailService emailService;

    public SupportController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/contact")
    public ResponseEntity<?> handleContactSubmit(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String message = request.get("message");

        if (name == null || name.isBlank() || email == null || email.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, Email, and Message are required."));
        }

        String subject = "BorrowIT Support Ticket from " + name;
        String body = "Hello Adithya,\n\n" +
                "You have received a new support inquiry on BorrowIT:\n\n" +
                "--------------------------------------------------\n" +
                "Name: " + name + "\n" +
                "Email: " + email + "\n" +
                "--------------------------------------------------\n\n" +
                "Message:\n" + message + "\n\n" +
                "Please reply to the user directly at " + email + ".\n\n" +
                "Best,\n" +
                "BorrowIT Automated Mail Desk";

        emailService.sendEmail("adithya70755@gmail.com", subject, body);

        return ResponseEntity.ok(Map.of("success", true, "message", "Support ticket received. Email dispatched to desk."));
    }
}
