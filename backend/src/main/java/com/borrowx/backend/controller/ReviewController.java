package com.borrowx.backend.controller;

import com.borrowx.backend.dto.ReviewDTO;
import com.borrowx.backend.dto.ReviewResponseDTO;
import com.borrowx.backend.exception.BadRequestException;
import com.borrowx.backend.service.JwtService;
import com.borrowx.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;

    public ReviewController(ReviewService reviewService,
                            JwtService jwtService) {
        this.reviewService = reviewService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ReviewResponseDTO addReview(
            @Valid @RequestBody ReviewDTO reviewDTO,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadRequestException("Invalid Authorization header.");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return reviewService.addReview(reviewDTO, email);
    }
}