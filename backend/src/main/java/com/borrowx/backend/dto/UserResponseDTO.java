package com.borrowx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Double trustScore;
    private Boolean verified;
    private String verificationOtp;

    public UserResponseDTO(Long id, String fullName, String email, String phoneNumber, Double trustScore, Boolean verified) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.trustScore = trustScore;
        this.verified = verified;
        this.verificationOtp = null;
    }
}