package com.coffee.service;

import com.coffee.entity.Order;
import com.coffee.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import this

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    // Use @Transactional to ensure the entire operation is atomic
    @Transactional
    public void saveOrder(Order order) {
        orderRepository.save(order);
    }
}