package com.borrowx.backend.controller;

import com.borrowx.backend.dto.LoginRequestDTO;
import com.borrowx.backend.dto.LoginResponseDTO;
import com.borrowx.backend.dto.UserResponseDTO;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody User user) {
        return userService.convertToDTO(userService.registerUser(user));
    }

    // Initiate Registration (Temporary storage & OTP dispatch)
    @PostMapping("/register/initiate")
    public org.springframework.http.ResponseEntity<?> initiateRegistration(@Valid @RequestBody User user) {
        userService.initiateRegistration(user);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                "message", "Verification code dispatched successfully"
        ));
    }

    // Resend Registration OTP
    @PostMapping("/register/resend")
    public org.springframework.http.ResponseEntity<?> resendRegistrationOtp(@RequestParam String email) {
        userService.resendRegistrationOtp(email);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                "message", "Verification code resent successfully"
        ));
    }

    // Complete Registration (Verify OTP & Create database entry)
    @PostMapping("/register/verify")
    public LoginResponseDTO completeRegistration(
            @RequestParam String email,
            @RequestParam String otp) {
        return userService.completeRegistration(email, otp);
    }

    // Reset Database (Wipes all tables)
    @PostMapping("/reset-db")
    public org.springframework.http.ResponseEntity<?> resetDatabase() {
        userService.resetDatabase();
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("message", "Database successfully reset and cleared."));
    }

    // Login User
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO loginRequest) {
        return userService.login(loginRequest);
    }

    // Get All Users
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsersDTO();
    }

    // Get User By ID
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.convertToDTO(userService.getUserById(id));
    }

    // Update User
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User updatedUser) {

        return userService.convertToDTO(
                userService.updateUser(id, updatedUser)
        );
    }

    // Delete User
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully!";
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public org.springframework.http.ResponseEntity<?> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        userService.verifyOtp(email, otp);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("message", "Account verified successfully"));
    }

    // Resend OTP
    @PostMapping("/resend-otp")
    public org.springframework.http.ResponseEntity<?> resendOtp(
            @RequestParam String email) {
        String otp = userService.resendOtp(email);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                "message", "Verification code resent",
                "verificationOtp", otp
        ));
    }
}