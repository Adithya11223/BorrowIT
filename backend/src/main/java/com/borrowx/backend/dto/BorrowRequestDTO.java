package com.borrowx.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BorrowRequestDTO {

    private Long itemId;

    private LocalDate borrowDate;

    private LocalDate returnDate;

}