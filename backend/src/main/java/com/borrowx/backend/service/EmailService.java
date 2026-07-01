package com.borrowx.backend.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final String resendApiKey;
    private final String brevoApiKey;
    private final HttpClient httpClient;
    private static final java.util.List<String> mailLogs = new java.util.concurrent.CopyOnWriteArrayList<>();

    public static java.util.List<String> getMailLogs() {
        return mailLogs;
    }

    public EmailService() {
        String resKey = System.getenv("RESEND_API_KEY");
        this.resendApiKey = (resKey != null && !resKey.trim().isEmpty()) ? resKey.trim() : "";

        String brevKey = System.getenv("BREVO_API_KEY");
        this.brevoApiKey = (brevKey != null && !brevKey.trim().isEmpty()) ? brevKey.trim() : "";

        this.httpClient = HttpClient.newHttpClient();

        String provider = "None (Fallback Mode)";
        if (!brevoApiKey.isEmpty()) {
            provider = "Brevo";
        } else if (!resendApiKey.isEmpty()) {
            provider = "Resend";
        }
        mailLogs.add(java.time.LocalDateTime.now() + " - [INIT] Email Engine initialized with provider: " + provider);
    }

    public void sendEmail(String to, String subject, String body) {
        if (!brevoApiKey.isEmpty()) {
            sendViaBrevo(to, subject, body);
        } else if (!resendApiKey.isEmpty()) {
            sendViaResend(to, subject, body);
        } else {
            String logMsg = "[WARNING] No email provider API keys (RESEND_API_KEY or BREVO_API_KEY) found. Using fallback.";
            System.err.println(logMsg);
            mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
            printFallback(to, subject, body);
        }
    }

    private void sendViaResend(String to, String subject, String body) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                String escapedTo = escapeJson(to);
                String escapedSubject = escapeJson(subject);
                String escapedBody = escapeJson(body);

                String jsonPayload = String.format(
                    "{\"from\":\"BorrowIt <onboarding@resend.dev>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\"}",
                    escapedTo, escapedSubject, escapedBody
                );

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.resend.com/emails"))
                        .header("Authorization", "Bearer " + resendApiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    String logMsg = "[SUCCESS] Resend sent email to " + to + ". Status: " + response.statusCode();
                    System.out.println(logMsg);
                    mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                } else {
                    String logMsg = "[ERROR] Resend failed for " + to + ". Status: " + response.statusCode() + ", Response: " + response.body();
                    System.err.println(logMsg);
                    mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                    printFallback(to, subject, body);
                }
            } catch (Exception e) {
                String logMsg = "[EXCEPTION] Resend error for " + to + ": " + e.getMessage();
                System.err.println(logMsg);
                mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                printFallback(to, subject, body);
            }
        });
    }

    private void sendViaBrevo(String to, String subject, String body) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                String escapedTo = escapeJson(to);
                String escapedSubject = escapeJson(subject);
                String escapedBody = escapeJson(body);

                // Use the recipient or a default sender registered in Brevo
                String senderEmail = "onboarding@resend.dev";

                String jsonPayload = String.format(
                    "{\"sender\":{\"name\":\"BorrowIt\",\"email\":\"%s\"},\"to\":[{\"email\":\"%s\"}],\"subject\":\"%s\",\"htmlContent\":\"%s\"}",
                    senderEmail, escapedTo, escapedSubject, escapedBody
                );

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                        .header("api-key", brevoApiKey)
                        .header("Content-Type", "application/json")
                        .header("Accept", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    String logMsg = "[SUCCESS] Brevo sent email to " + to + ". Status: " + response.statusCode();
                    System.out.println(logMsg);
                    mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                } else {
                    String logMsg = "[ERROR] Brevo failed for " + to + ". Status: " + response.statusCode() + ", Response: " + response.body();
                    System.err.println(logMsg);
                    mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                    printFallback(to, subject, body);
                }
            } catch (Exception e) {
                String logMsg = "[EXCEPTION] Brevo error for " + to + ": " + e.getMessage();
                System.err.println(logMsg);
                mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
                printFallback(to, subject, body);
            }
        });
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }

    private void printFallback(String to, String subject, String body) {
        System.out.println("==================================================");
        System.out.println("[FALLBACK EMAIL OUTBOX]");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("BODY:\n" + body);
        System.out.println("==================================================");
    }
}
