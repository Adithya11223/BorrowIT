package com.borrowx.backend.service;

import com.borrowx.backend.dto.BorrowRequestResponseDTO;
import com.borrowx.backend.dto.BorrowRequestDTO;
import com.borrowx.backend.entity.BorrowRequest;
import com.borrowx.backend.entity.Item;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.enums.BorrowRequestStatus;
import com.borrowx.backend.exception.BadRequestException;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.exception.UnauthorizedException;
import com.borrowx.backend.repository.BorrowRequestRepository;
import com.borrowx.backend.repository.ItemRepository;
import com.borrowx.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;

    public BorrowRequestService(BorrowRequestRepository borrowRequestRepository,
                                UserRepository userRepository,
                                ItemRepository itemRepository,
                                NotificationService notificationService) {
        this.borrowRequestRepository = borrowRequestRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
    }

    // Convert Entity -> DTO
    private BorrowRequestResponseDTO mapToDTO(BorrowRequest request) {

        return new BorrowRequestResponseDTO(
                request.getId(),
                request.getItem().getId(),
                request.getItem().getItemName(),
                request.getBorrower().getFullName(),
                request.getOwner().getFullName(),
                request.getBorrowDate(),
                request.getReturnDate(),
                request.getStatus()
        );
    }

    // Create Borrow Request
    public BorrowRequestResponseDTO createRequest(BorrowRequestDTO requestDTO, String borrowerEmail) {

        User borrower = userRepository.findByEmail(borrowerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Borrower not found"));

        Item item = itemRepository.findById(requestDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        User owner = item.getOwner();

        if (owner == null) {
            throw new ResourceNotFoundException("Owner not found");
        }

        if (owner.getId().equals(borrower.getId())) {
            throw new BadRequestException("You cannot borrow your own item.");
        }

        BorrowRequest request = new BorrowRequest();
        request.setItem(item);
        request.setBorrower(borrower);
        request.setOwner(owner);
        request.setBorrowDate(requestDTO.getBorrowDate() != null ? requestDTO.getBorrowDate() : LocalDate.now());
        request.setReturnDate(requestDTO.getReturnDate());
        request.setStatus(BorrowRequestStatus.PENDING);

        BorrowRequest savedRequest = borrowRequestRepository.save(request);

        // Notify item owner
        notificationService.createNotification(
                owner,
                "New Borrow Request",
                borrower.getFullName() + " has requested to borrow your item: " + item.getItemName()
        );

        return mapToDTO(savedRequest);
    }

    // Requests created by borrower
    public List<BorrowRequestResponseDTO> getBorrowerRequests(String email) {

        User borrower = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return borrowRequestRepository.findByBorrower(borrower)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Requests received by owner
    public List<BorrowRequestResponseDTO> getOwnerRequests(String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return borrowRequestRepository.findByOwner(owner)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Approve Request
    public BorrowRequestResponseDTO approveRequest(Long requestId, String ownerEmail) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow request not found"));

        if (!request.getOwner().getEmail().equals(ownerEmail)) {
            throw new UnauthorizedException("Only owner can approve this request.");
        }

        request.setStatus(BorrowRequestStatus.APPROVED);

        // Automatically update item availability to false since it is now approved and active!
        Item item = request.getItem();
        item.setAvailable(false);
        itemRepository.save(item);

        BorrowRequest updatedRequest = borrowRequestRepository.save(request);

        // Notify borrower
        notificationService.createNotification(
                request.getBorrower(),
                "Request Approved",
                "Your request to borrow " + item.getItemName() + " has been approved by the owner."
        );

        return mapToDTO(updatedRequest);
    }

    // Reject Request
    public BorrowRequestResponseDTO rejectRequest(Long requestId, String ownerEmail) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow request not found"));

        if (!request.getOwner().getEmail().equals(ownerEmail)) {
            throw new UnauthorizedException("Only owner can reject this request.");
        }

        request.setStatus(BorrowRequestStatus.REJECTED);

        BorrowRequest updatedRequest = borrowRequestRepository.save(request);

        // Notify borrower
        notificationService.createNotification(
                request.getBorrower(),
                "Request Rejected",
                "Your request to borrow " + request.getItem().getItemName() + " was declined by the owner."
        );

        return mapToDTO(updatedRequest);
    }

    // Return Item
    public BorrowRequestResponseDTO returnItem(Long requestId, String borrowerEmail) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow request not found"));

        if (!request.getBorrower().getEmail().equals(borrowerEmail)) {
            throw new UnauthorizedException("Only borrower can return this item.");
        }

        request.setStatus(BorrowRequestStatus.RETURNED);
        request.setReturnDate(LocalDate.now());

        // Automatically restore item availability to true upon successful return!
        Item item = request.getItem();
        item.setAvailable(true);
        itemRepository.save(item);

        BorrowRequest updatedRequest = borrowRequestRepository.save(request);

        // Notify item owner
        notificationService.createNotification(
                request.getOwner(),
                "Item Returned",
                borrowerEmail + " has marked the item as returned: " + item.getItemName()
        );

        return mapToDTO(updatedRequest);
    }
}