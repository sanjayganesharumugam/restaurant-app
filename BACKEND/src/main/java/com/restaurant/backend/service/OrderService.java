package com.restaurant.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.backend.dto.OrderRequest;
import com.restaurant.backend.dto.OrderStatusUpdate;
import com.restaurant.backend.model.Cart;
import com.restaurant.backend.model.Order;
import com.restaurant.backend.model.OrderItem;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.CartRepository;
import com.restaurant.backend.repository.OrderItemRepository;
import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        List<Cart> cartItems = cartRepository.findByUserId(request.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = cartItems.stream().mapToDouble(c -> c.getMenuItem().getPrice() * c.getQuantity()).sum();

        Order order = new Order(user, Order.Status.PLACED, total, request.getLocation(), LocalDateTime.now());
        order = orderRepository.save(order);

        for (Cart cart : cartItems) {
            OrderItem orderItem = new OrderItem(order, cart.getMenuItem(), cart.getQuantity());
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartRepository.deleteAll(cartItems);

        return order;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order updateOrderStatus(Long id, OrderStatusUpdate update) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(update.getStatus());
        return orderRepository.save(order);
    }
}