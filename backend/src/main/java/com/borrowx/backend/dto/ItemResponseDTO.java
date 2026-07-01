package com.borrowx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {

    private Long id;

    private String itemName;

    private String description;

    private Double pricePerDay;

    private String category;

    private String location;

    private Boolean available;

    private Double deposit;

    private String itemCondition;

    private Double latitude;

    private Double longitude;

    private List<String> imageUrls;

    private Long ownerId;

    private String ownerName;

    private UserResponseDTO owner;

}