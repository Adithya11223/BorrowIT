package com.borrowx.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "items")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @Column(length = 2000)
    private String description;

    @NotNull(message = "Price is required")
    private Double pricePerDay;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    private Boolean available = true;

    // Optional Security Deposit
    private Double deposit;

    // Item Quality tags (New, Like New, Good, Fair)
    private String itemCondition;

    // Coordinates for proximity search
    private Double latitude;
    private Double longitude;

    // Support multiple images
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url", length = 1048576) // Large text space for base64 or long links
    private List<String> imageUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
}