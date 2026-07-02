package com.borrowx.backend.service;

import com.borrowx.backend.dto.LoginRequestDTO;
import com.borrowx.backend.dto.LoginResponseDTO;
import com.borrowx.backend.dto.UserResponseDTO;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.exception.BadRequestException;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @org.springframework.beans.factory.annotation.Autowired
    private com.borrowx.backend.repository.BorrowRequestRepository borrowRequestRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private com.borrowx.backend.repository.ReviewRepository reviewRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private com.borrowx.backend.repository.NotificationRepository notificationRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private com.borrowx.backend.repository.MessageRepository messageRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private com.borrowx.backend.repository.ItemRepository itemRepository;

    // Reset Database
    @org.springframework.transaction.annotation.Transactional
    public void resetDatabase() {
        borrowRequestRepository.deleteAll();
        reviewRepository.deleteAll();
        notificationRepository.deleteAll();
        messageRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();
        System.out.println("[ADMIN] Database reset completed.");
    }

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    // Register User (Direct Database Creation with validation)
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new BadRequestException("Phone number is already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setTrustScore(50.0);
        user.setVerified(true);
        return userRepository.save(user);
    }

    // Login
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getVerified())) {
            throw new BadRequestException("Account not verified.");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponseDTO(token, convertToDTO(user));
    }

    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get All Users (DTO)
    public List<UserResponseDTO> getAllUsersDTO() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get User By ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // Update User
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);

        if (!existingUser.getEmail().equals(updatedUser.getEmail())
                && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existingUser);
    }

    // Delete User
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    // Entity -> DTO
    public UserResponseDTO convertToDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getTrustScore(),
                user.getVerified(),
                user.getVerificationOtp()
        );
    }
}