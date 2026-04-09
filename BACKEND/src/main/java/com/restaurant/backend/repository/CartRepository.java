package com.restaurant.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.backend.model.Cart;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUser(User user);

    Optional<Cart> findByUserAndMenuItem(User user, MenuItem menuItem);

}