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

    // Initiate Registration (Step 1 Name/Email -> generate & send OTP)
    @PostMapping("/register/initiate")
    public org.springframework.http.ResponseEntity<?> initiateRegistration(@RequestBody java.util.Map<String, String> payload) {
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        if (fullName == null || fullName.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new com.borrowx.backend.exception.BadRequestException("Full Name and Email are required.");
        }
        userService.initiateRegistration(fullName, email);
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

    // Verify Registration OTP (Step 3 verify OTP)
    @PostMapping("/register/verify")
    public org.springframework.http.ResponseEntity<?> verifyRegistrationOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        userService.verifyRegistrationOtp(email, otp);
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                "message", "Email verified successfully"
        ));
    }

    // Complete Registration (Step 4 final user creation & JWT login)
    @PostMapping("/register")
    public LoginResponseDTO completeRegistration(@Valid @RequestBody User user) {
        return userService.completeRegistration(user);
    }

    // Reset Database (Wipes all tables)
    @PostMapping("/reset-db")
    public org.springframework.http.ResponseEntity<?> resetDatabase() {
        userService.resetDatabase();
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("message", "Database successfully reset and cleared."));
    }

    // Get Mail Dispatch Logs (For testing/debugging purposes)
    @GetMapping("/mail-logs")
    public java.util.List<String> getMailLogs() {
        return com.borrowx.backend.service.EmailService.getMailLogs();
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


}