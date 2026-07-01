package com.borrowx.backend.service;

import com.borrowx.backend.dto.ReviewDTO;
import com.borrowx.backend.dto.ReviewResponseDTO;
import com.borrowx.backend.entity.BorrowRequest;
import com.borrowx.backend.entity.Review;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.enums.BorrowRequestStatus;
import com.borrowx.backend.exception.BadRequestException;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.BorrowRequestRepository;
import com.borrowx.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BorrowRequestRepository borrowRequestRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BorrowRequestRepository borrowRequestRepository) {
        this.reviewRepository = reviewRepository;
        this.borrowRequestRepository = borrowRequestRepository;
    }

    private ReviewResponseDTO mapToDTO(Review review) {
        return new ReviewResponseDTO(
                review.getId(),
                review.getReviewer().getFullName(),
                review.getReviewee().getFullName(),
                review.getItem().getItemName(),
                review.getRating(),
                review.getComment()
        );
    }

    public ReviewResponseDTO addReview(ReviewDTO reviewDTO, String reviewerEmail) {

        BorrowRequest borrowRequest = borrowRequestRepository
                .findById(reviewDTO.getBorrowRequestId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Borrow request not found"));

        if (borrowRequest.getStatus() != BorrowRequestStatus.RETURNED) {
            throw new BadRequestException(
                    "Review is allowed only after returning the item.");
        }

        User reviewer;
        User reviewee;

        if (borrowRequest.getBorrower().getEmail().equals(reviewerEmail)) {
            reviewer = borrowRequest.getBorrower();
            reviewee = borrowRequest.getOwner();
        } else if (borrowRequest.getOwner().getEmail().equals(reviewerEmail)) {
            reviewer = borrowRequest.getOwner();
            reviewee = borrowRequest.getBorrower();
        } else {
            throw new BadRequestException(
                    "You are not part of this borrow request.");
        }

        if (reviewRepository
                .findByReviewerAndRevieweeAndItem_Id(
                        reviewer,
                        reviewee,
                        borrowRequest.getItem().getId())
                .isPresent()) {

            throw new BadRequestException(
                    "You have already reviewed this user for this item.");
        }

        if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
            throw new BadRequestException(
                    "Rating must be between 1 and 5.");
        }

        Review review = new Review();

        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setItem(borrowRequest.getItem());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        Review savedReview = reviewRepository.save(review);

        return mapToDTO(savedReview);
    }
}