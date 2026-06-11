package com.restaurant.backend.dto;

import com.restaurant.backend.model.MenuItem.Category;
import com.restaurant.backend.model.MenuItem.Type;

public class MenuItemRequest {

    private String name;
    private Category category;
    private Type type;
    private Double price;
    private String description;
    private String imageUrl;

    public MenuItemRequest() {}

    public MenuItemRequest(String name, Category category, Type type, Double price, String description, String imageUrl) {
        this.name = name;
        this.category = category;
        this.type = type;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}