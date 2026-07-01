package com.borrowx.backend.repository;

import com.borrowx.backend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // Search by Item Name
    List<Item> findByItemNameContainingIgnoreCase(String keyword);

    // Filter by Category
    List<Item> findByCategoryIgnoreCase(String category);

    // Filter by Location
    List<Item> findByLocationIgnoreCase(String location);

    // Filter by Category + Location
    List<Item> findByCategoryIgnoreCaseAndLocationIgnoreCase(
            String category,
            String location
    );
}