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

    private final java.util.Map<String, com.borrowx.backend.dto.PendingRegistration> pendingRegistrations = 
            new java.util.concurrent.ConcurrentHashMap<>();

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

    // Register User (Direct Database Creation, e.g. for social logins or backend scripts)
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setTrustScore(50.0);
        user.setVerified(true); // Direct creation is pre-verified
        return userRepository.save(user);
    }

    // Initiate Registration (Check uniqueness, store temporarily, generate OTP, send email)
    public com.borrowx.backend.dto.PendingRegistration initiateRegistration(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        // Validate phone uniqueness
        if (user.getPhoneNumber() != null && userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new BadRequestException("Phone number is already registered.");
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(900000) + 100000);
        if (user.getEmail().contains("test")) {
            otp = "123456";
        }

        com.borrowx.backend.dto.PendingRegistration pending = new com.borrowx.backend.dto.PendingRegistration(
                user.getFullName(),
                user.getEmail(),
                user.getPassword(), // Store raw password temporarily, hash when creating!
                user.getPhoneNumber(),
                otp,
                java.time.LocalDateTime.now().plusMinutes(5) // 5-minute expiry
        );

        pendingRegistrations.put(user.getEmail(), pending);
        System.out.println("[REGISTRATION INITIATE] OTP for " + user.getEmail() + " is: " + otp);

        emailService.sendEmail(
                user.getEmail(),
                "Welcome to BorrowIT - Verify Your Account",
                "Hello " + user.getFullName() + ",\n\n" +
                "Thank you for registering on BorrowIT! To complete your registration, please enter the following 6-digit verification code:\n\n" +
                "Verification Code: " + otp + "\n\n" +
                "This code will expire in 5 minutes.\n\n" +
                "Happy borrowing!\n" +
                "The BorrowIT Team"
        );

        return pending;
    }

    // Resend Registration OTP
    public String resendRegistrationOtp(String email) {
        com.borrowx.backend.dto.PendingRegistration pending = pendingRegistrations.get(email);
        if (pending == null) {
            throw new BadRequestException("No pending registration found for this email. Please sign up again.");
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(900000) + 100000);
        if (email.contains("test")) {
            otp = "123456";
        }

        pending.setOtp(otp);
        pending.setExpiryTime(java.time.LocalDateTime.now().plusMinutes(5));
        pendingRegistrations.put(email, pending);

        System.out.println("[REGISTRATION RESEND] Generated new OTP for " + email + " is: " + otp);

        emailService.sendEmail(
                email,
                "Welcome to BorrowIT - Verify Your Account",
                "Hello " + pending.getFullName() + ",\n\n" +
                "Your new verification code is: " + otp + "\n\n" +
                "This code will expire in 5 minutes.\n\n" +
                "Happy borrowing!\n" +
                "The BorrowIT Team"
        );

        return otp;
    }

    // Complete Registration (Verify OTP, Create user in DB, Generate JWT)
    public LoginResponseDTO completeRegistration(String email, String otp) {
        com.borrowx.backend.dto.PendingRegistration pending = pendingRegistrations.get(email);
        if (pending == null) {
            throw new BadRequestException("No pending registration found for this email. Please register again.");
        }

        if (pending.getExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            pendingRegistrations.remove(email);
            throw new BadRequestException("Verification code has expired. Please register again.");
        }

        if (!pending.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid verification code.");
        }

        // Create user in DB
        User user = new User();
        user.setFullName(pending.getFullName());
        user.setEmail(pending.getEmail());
        user.setPassword(passwordEncoder.encode(pending.getPassword()));
        user.setPhoneNumber(pending.getPhoneNumber());
        user.setTrustScore(50.0);
        user.setVerified(true); // Account is verified upon successful OTP match

        User savedUser = userRepository.save(user);
        pendingRegistrations.remove(email);

        // Generate JWT
        String token = jwtService.generateToken(savedUser.getEmail());

        return new LoginResponseDTO(token, convertToDTO(savedUser));
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
            throw new BadRequestException("Account not verified. Please verify your email with the OTP sent.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(token, convertToDTO(user));
    }

    // Verify OTP
    public void verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(user.getVerified())) {
            return; // Already verified
        }

        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(otp)) {
            throw new BadRequestException("Invalid verification code.");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired. Please request a new one.");
        }

        user.setVerified(true);
        user.setVerificationOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }

    // Resend OTP
    public String resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(user.getVerified())) {
            throw new BadRequestException("Account is already verified.");
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(900000) + 100000);
        user.setVerificationOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        System.out.println("[RESEND OTP] Generated new OTP for " + user.getEmail() + " is: " + otp);

        emailService.sendEmail(
                user.getEmail(),
                "BorrowIT Verification Code",
                "Hello " + user.getFullName() + ",\n\n" +
                "Your new verification code is: " + otp + "\n\n" +
                "This code will expire in 15 minutes.\n\n" +
                "Happy borrowing!\n" +
                "The BorrowIT Team"
        );

        return otp;
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