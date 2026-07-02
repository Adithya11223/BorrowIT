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

    // Register User (Direct Sign Up & automatic login)
    @PostMapping("/register")
    public LoginResponseDTO register(@Valid @RequestBody User user) {
        String plainPassword = user.getPassword();
        User registered = userService.registerUser(user);
        com.borrowx.backend.dto.LoginRequestDTO loginReq = new com.borrowx.backend.dto.LoginRequestDTO();
        loginReq.setEmail(registered.getEmail());
        loginReq.setPassword(plainPassword);
        return userService.login(loginReq);
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