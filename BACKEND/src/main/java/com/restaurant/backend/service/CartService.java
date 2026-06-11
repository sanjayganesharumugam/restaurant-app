package com.restaurant.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.backend.dto.CartRequest;
import com.restaurant.backend.model.Cart;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.CartRepository;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Cart addToCart(CartRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        MenuItem item = menuItemRepository.findById(request.getItemId()).orElseThrow(() -> new RuntimeException("Item not found"));

        Optional<Cart> existing = cartRepository.findByUserIdAndMenuItemId(request.getUserId(), request.getItemId());
        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
            return cartRepository.save(cart);
        } else {
            Cart cart = new Cart(user, item, request.getQuantity());
            return cartRepository.save(cart);
        }
    }

    public List<Cart> getUserCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart updateCart(Long id, Integer quantity) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void removeFromCart(Long id) {
        cartRepository.deleteById(id);
    }
}