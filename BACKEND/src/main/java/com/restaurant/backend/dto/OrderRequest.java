package com.restaurant.backend.dto;

public class OrderRequest {

    private Long userId;
    private String location;

    public OrderRequest() {}

    public OrderRequest(Long userId, String location) {
        this.userId = userId;
        this.location = location;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}