package com.borrowx.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reviews")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Person giving the review
    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    // Person receiving the review
    @ManyToOne
    @JoinColumn(name = "reviewee_id")
    private User reviewee;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private Integer rating;

    @Column(length = 1000)
    private String comment;
}