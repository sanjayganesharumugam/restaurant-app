package com.restaurant.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.backend.dto.MenuItemRequest;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.repository.MenuItemRepository;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem addItem(MenuItemRequest request) {
        MenuItem item = new MenuItem(request.getName(), request.getCategory(), request.getType(),
                request.getPrice(), request.getDescription(), request.getImageUrl());
        return menuItemRepository.save(item);
    }

    public MenuItem updateItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setType(request.getType());
        item.setPrice(request.getPrice());
        item.setDescription(request.getDescription());
        item.setImageUrl(request.getImageUrl());
        return menuItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}