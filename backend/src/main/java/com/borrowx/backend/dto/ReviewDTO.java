package com.borrowx.backend.dto;

import lombok.Data;

@Data
public class ReviewDTO {

    // Borrow Request ID (used to identify the completed rental)
    private Long borrowRequestId;

    // Rating between 1 and 5
    private Integer rating;

    // Review comment
    private String comment;
}