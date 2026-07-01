package com.borrowx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingRegistration {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String otp;
    private LocalDateTime expiryTime;
}
