package com.borrowx.backend.repository;

import com.borrowx.backend.entity.BorrowRequest;
import com.borrowx.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    // Requests made by a borrower
    List<BorrowRequest> findByBorrower(User borrower);

    // Requests received by an owner
    List<BorrowRequest> findByOwner(User owner);

}