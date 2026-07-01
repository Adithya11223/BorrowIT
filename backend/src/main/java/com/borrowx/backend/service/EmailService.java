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

    public EmailService() {
        String envKey = System.getenv("RESEND_API_KEY");
        this.resendApiKey = (envKey != null && !envKey.trim().isEmpty()) ? envKey : "re_ddCL25FV_ARP6vAZ785n3kNaZoYAfZSWw";
        this.httpClient = HttpClient.newHttpClient();
    }

    public void sendEmail(String to, String subject, String body) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                String escapedTo = escapeJson(to);
                String escapedSubject = escapeJson(subject);
                String escapedBody = escapeJson(body);

                String jsonPayload = String.format(
                    "{\"from\":\"onboarding@resend.dev\",\"to\":[\"%s\"],\"subject\":\"%s\",\"text\":\"%s\"}",
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
                    System.out.println("[Resend Service] Email sent successfully to " + to);
                } else {
                    System.err.println("[Resend Service] Failed to send email to " + to + ". Status: " + response.statusCode() + ", Response: " + response.body());
                    printFallback(to, subject, body);
                }
            } catch (Exception e) {
                System.err.println("[Resend Service] Exception sending email to " + to + ": " + e.getMessage());
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
