package com.borrowx.backend.repository;

import com.borrowx.backend.entity.Review;
import com.borrowx.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // All reviews received by a user
    List<Review> findByReviewee(User reviewee);

    // All reviews given by a user
    List<Review> findByReviewer(User reviewer);

    // Check if reviewer already reviewed this item for this borrow request
    Optional<Review> findByReviewerAndRevieweeAndItem_Id(
            User reviewer,
            User reviewee,
            Long itemId
    );
}