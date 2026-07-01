package com.borrowx.backend.service;

import com.borrowx.backend.dto.ItemResponseDTO;
import com.borrowx.backend.dto.UserResponseDTO;
import com.borrowx.backend.entity.Item;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileUploadService {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final ItemRepository itemRepository;

    public FileUploadService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public ItemResponseDTO uploadImage(Long itemId, MultipartFile file) throws IOException {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found"));

        // Create uploads folder
        Files.createDirectories(Paths.get(uploadDirectory));

        // Generate unique filename
        String fileName = System.currentTimeMillis() + "_"
                + StringUtils.cleanPath(file.getOriginalFilename());

        // Save file
        Path filePath = Paths.get(uploadDirectory).resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        // Save image path in Item
        if (item.getImageUrls() == null) {
            item.setImageUrls(new java.util.ArrayList<>());
        }
        item.getImageUrls().add("/uploads/" + fileName);

        Item savedItem = itemRepository.save(item);

        UserResponseDTO ownerDTO = null;
        if (savedItem.getOwner() != null) {
            User owner = savedItem.getOwner();
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
                savedItem.getId(),
                savedItem.getItemName(),
                savedItem.getDescription(),
                savedItem.getPricePerDay(),
                savedItem.getCategory(),
                savedItem.getLocation(),
                savedItem.getAvailable(),
                savedItem.getDeposit(),
                savedItem.getItemCondition(),
                savedItem.getLatitude(),
                savedItem.getLongitude(),
                savedItem.getImageUrls(),
                savedItem.getOwner() != null ? savedItem.getOwner().getId() : null,
                savedItem.getOwner() != null ? savedItem.getOwner().getFullName() : null,
                ownerDTO
        );
    }
}