package com.restaurant.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.backend.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}