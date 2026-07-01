package com.borrowx.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            // Graceful fallback to print log for developers if SMTP settings are missing
            System.out.println("==================================================");
            System.out.println("[MOCK EMAIL OUTBOX]");
            System.out.println("TO: " + to);
            System.out.println("SUBJECT: " + subject);
            System.out.println("BODY:\n" + body);
            System.out.println("==================================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@borrowx.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("[Email Service] Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("[Email Service] Failed to send email to " + to + " (falling back to print): " + e.getMessage());
            System.out.println("==================================================");
            System.out.println("[FALLBACK EMAIL OUTBOX]");
            System.out.println("TO: " + to);
            System.out.println("SUBJECT: " + subject);
            System.out.println("BODY:\n" + body);
            System.out.println("==================================================");
        }
    }
}
