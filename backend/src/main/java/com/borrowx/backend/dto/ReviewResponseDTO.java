package com.borrowx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponseDTO {

    private Long id;

    private String reviewerName;

    private String revieweeName;

    private String itemName;

    private Integer rating;

    private String comment;
}