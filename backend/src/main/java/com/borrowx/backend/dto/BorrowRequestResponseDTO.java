package com.borrowx.backend.dto;

import com.borrowx.backend.enums.BorrowRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequestResponseDTO {

    private Long requestId;

    private Long itemId;

    private String itemName;

    private String borrowerName;

    private String ownerName;

    private LocalDate borrowDate;

    private LocalDate returnDate;

    private BorrowRequestStatus status;
}