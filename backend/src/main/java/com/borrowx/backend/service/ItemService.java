package com.borrowx.backend.service;

import com.borrowx.backend.dto.ItemResponseDTO;
import com.borrowx.backend.dto.UserResponseDTO;
import com.borrowx.backend.entity.Item;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.exception.BadRequestException;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.ItemRepository;
import com.borrowx.backend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository,
                       UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // =====================================
    // Entity -> DTO
    // =====================================
    private ItemResponseDTO mapToDTO(Item item) {

        String ownerName = "Unknown";
        Long ownerId = null;
        UserResponseDTO ownerDTO = null;

        if (item.getOwner() != null) {
            User owner = item.getOwner();
            ownerName = owner.getFullName();
            ownerId = owner.getId();
            ownerDTO = new UserResponseDTO(
                    owner.getId(),
                    owner.getFullName(),
                    owner.getEmail(),
                    owner.getPhoneNumber(),
                    owner.getTrustScore(),
                    owner.getVerified()
            );
        }

        return new ItemResponseDTO(
                item.getId(),
                item.getItemName(),
                item.getDescription(),
                item.getPricePerDay(),
                item.getCategory(),
                item.getLocation(),
                item.getAvailable(),
                item.getDeposit(),
                item.getItemCondition(),
                item.getLatitude(),
                item.getLongitude(),
                item.getImageUrls(),
                ownerId,
                ownerName,
                ownerDTO
        );
    }

    // =====================================
    // Add Item
    // =====================================
    public ItemResponseDTO addItem(Item item, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        item.setOwner(owner);

        Item savedItem = itemRepository.save(item);

        return mapToDTO(savedItem);
    }

    // =====================================
    // Get All Items
    // =====================================
    public List<ItemResponseDTO> getAllItems() {

        return itemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // Get Item By ID
    // =====================================
    public ItemResponseDTO getItemById(Long id) {

        Item item = itemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found"));

        return mapToDTO(item);
    }

    // =====================================
    // Pagination
    // =====================================
    public List<ItemResponseDTO> getItemsWithPagination(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return itemRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // Sorting
    // =====================================
    public List<ItemResponseDTO> getItemsSorted(String field, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(field).descending()
                : Sort.by(field).ascending();

        return itemRepository.findAll(sort)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // Search
    // =====================================
    public List<ItemResponseDTO> searchItems(String keyword) {

        return itemRepository
                .findByItemNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // Filter
    // =====================================
    public List<ItemResponseDTO> filterItems(String category,
                                             String location) {

        List<Item> items;

        if (category != null && !category.isBlank()
                && location != null && !location.isBlank()) {

            items = itemRepository
                    .findByCategoryIgnoreCaseAndLocationIgnoreCase(
                            category,
                            location
                    );

        } else if (category != null && !category.isBlank()) {

            items = itemRepository.findByCategoryIgnoreCase(category);

        } else if (location != null && !location.isBlank()) {

            items = itemRepository.findByLocationIgnoreCase(location);

        } else {

            items = itemRepository.findAll();
        }

        return items.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // Update Item
    // =====================================
    public ItemResponseDTO updateItem(Long id, Item updatedItem) {

        Item item = itemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found"));

        item.setItemName(updatedItem.getItemName());
        item.setDescription(updatedItem.getDescription());
        item.setPricePerDay(updatedItem.getPricePerDay());
        item.setCategory(updatedItem.getCategory());
        item.setLocation(updatedItem.getLocation());
        item.setAvailable(updatedItem.getAvailable());
        item.setDeposit(updatedItem.getDeposit());
        item.setItemCondition(updatedItem.getItemCondition());
        item.setLatitude(updatedItem.getLatitude());
        item.setLongitude(updatedItem.getLongitude());

        if (updatedItem.getImageUrls() != null) {
            item.setImageUrls(updatedItem.getImageUrls());
        }

        Item savedItem = itemRepository.save(item);

        return mapToDTO(savedItem);
    }

    // =====================================
    // Delete Item
    // =====================================
    public void deleteItem(Long id) {

        if (!itemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Item not found");
        }

        try {
            itemRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException(
                    "Cannot delete item because it has associated borrow requests."
            );
        }
    }
}