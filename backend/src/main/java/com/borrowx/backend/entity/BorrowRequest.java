package com.borrowx.backend.entity;

import com.borrowx.backend.enums.BorrowRequestStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "borrow_requests")
@Data
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Item being borrowed
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    // User requesting the item
    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private User borrower;

    // Owner of the item
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private LocalDate borrowDate;

    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private BorrowRequestStatus status;
}