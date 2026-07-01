package com.borrowx.backend.controller;

import com.borrowx.backend.dto.BorrowRequestDTO;
import com.borrowx.backend.dto.BorrowRequestResponseDTO;
import com.borrowx.backend.service.BorrowRequestService;
import com.borrowx.backend.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;
    private final JwtService jwtService;

    public BorrowRequestController(BorrowRequestService borrowRequestService,
                                   JwtService jwtService) {
        this.borrowRequestService = borrowRequestService;
        this.jwtService = jwtService;
    }

    // Create Borrow Request
    @PostMapping
    public BorrowRequestResponseDTO createRequest(
            @RequestBody BorrowRequestDTO requestDTO,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.createRequest(
                requestDTO,
                email
        );
    }

    // My Borrow Requests
    @GetMapping("/my")
    public List<BorrowRequestResponseDTO> myRequests(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.getBorrowerRequests(email);
    }

    // Requests received for my items
    @GetMapping("/received")
    public List<BorrowRequestResponseDTO> receivedRequests(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.getOwnerRequests(email);
    }

    // Approve Borrow Request
    @PutMapping("/{requestId}/approve")
    public BorrowRequestResponseDTO approveRequest(
            @PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.approveRequest(requestId, email);
    }

    // Reject Borrow Request
    @PutMapping("/{requestId}/reject")
    public BorrowRequestResponseDTO rejectRequest(
            @PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.rejectRequest(requestId, email);
    }

    // Return Item
    @PutMapping("/{requestId}/return")
    public BorrowRequestResponseDTO returnItem(
            @PathVariable Long requestId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return borrowRequestService.returnItem(requestId, email);
    }
}