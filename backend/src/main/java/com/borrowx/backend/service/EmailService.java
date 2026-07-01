package com.borrowx.backend.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final String resendApiKey;
    private final HttpClient httpClient;
    private static final java.util.List<String> mailLogs = new java.util.concurrent.CopyOnWriteArrayList<>();

    public static java.util.List<String> getMailLogs() {
        return mailLogs;
    }

    public EmailService() {
        String envKey = System.getenv("RESEND_API_KEY");
        // No hardcoded key fallback to comply with security requirements
        this.resendApiKey = (envKey != null && !envKey.trim().isEmpty()) ? envKey.trim() : "";
        this.httpClient = HttpClient.newHttpClient();
        
        String maskedKey = resendApiKey.isEmpty() 
                ? "EMPTY_KEY" 
                : (resendApiKey.length() > 10 ? resendApiKey.substring(0, 7) + "..." + resendApiKey.substring(resendApiKey.length() - 4) : "INVALID_LENGTH");
        mailLogs.add(java.time.LocalDateTime.now() + " - [INIT] Loaded Resend API Key: " + maskedKey + " (Source: Environment)");
    }

    public void sendEmail(String to, String subject, String body) {
        if (resendApiKey.isEmpty()) {
            String logMsg = "[ERROR] RESEND_API_KEY is not configured in the Environment Variables!";
            System.err.println(logMsg);
            mailLogs.add(java.time.LocalDateTime.now() + " - " + logMsg);
            printFallback(to, subject, body);
            return;
        }

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
