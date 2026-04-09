package com.restaurant.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.backend.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

}