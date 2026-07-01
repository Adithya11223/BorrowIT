package com.borrowx.backend.controller;

import com.borrowx.backend.dto.ItemResponseDTO;
import com.borrowx.backend.entity.Item;
import com.borrowx.backend.service.ItemService;
import com.borrowx.backend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    private final ItemService itemService;
    private final JwtService jwtService;

    public ItemController(ItemService itemService,
                          JwtService jwtService) {
        this.itemService = itemService;
        this.jwtService = jwtService;
    }

    // Add Item
    @PostMapping
    public ItemResponseDTO addItem(
            @Valid @RequestBody Item item,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return itemService.addItem(item, email);
    }

    // Get All Items
    @GetMapping
    public List<ItemResponseDTO> getAllItems() {
        return itemService.getAllItems();
    }

    // Pagination
    @GetMapping("/page")
    public List<ItemResponseDTO> getItemsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return itemService.getItemsWithPagination(page, size);
    }

    // Sorting
    @GetMapping("/sort")
    public List<ItemResponseDTO> getItemsSorted(
            @RequestParam String field,
            @RequestParam(defaultValue = "asc") String direction) {

        return itemService.getItemsSorted(field, direction);
    }

    // Get Item By ID
    @GetMapping("/{id}")
    public ItemResponseDTO getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    // Search
    @GetMapping("/search")
    public List<ItemResponseDTO> searchItems(
            @RequestParam String keyword) {

        return itemService.searchItems(keyword);
    }

    // Filter
    @GetMapping("/filter")
    public List<ItemResponseDTO> filterItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {

        return itemService.filterItems(category, location);
    }

    // Update
    @PutMapping("/{id}")
    public ItemResponseDTO updateItem(
            @PathVariable Long id,
            @Valid @RequestBody Item item) {

        return itemService.updateItem(id, item);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }
}