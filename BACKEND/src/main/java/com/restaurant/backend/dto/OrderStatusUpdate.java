package com.restaurant.backend.dto;

import com.restaurant.backend.model.Order.Status;

public class OrderStatusUpdate {

    private Status status;

    public OrderStatusUpdate() {}

    public OrderStatusUpdate(Status status) {
        this.status = status;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}