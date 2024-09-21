package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
import com.mactiem.clothingstore.website.DTO.OrderResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.Order;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.OrderMapper;
import com.mactiem.clothingstore.website.repository.OrderRepository;
import com.mactiem.clothingstore.website.validator.OrderValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;

    @Autowired
    @Lazy
    public OrderService(OrderMapper orderMapper, OrderRepository orderRepository, OrderValidator orderValidator) {
        this.orderMapper = orderMapper;
        this.orderRepository = orderRepository;
        this.orderValidator = orderValidator;
    }

    //- Helper
    public Order findOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Order", id)));
    }

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    //- Methods

    public OrderResponseDTO getOrderById(String id) {
        Order order = findOrderById(id);
        return orderMapper.toDTO(order);
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderMapper.toListDTOs(findAllOrders());
    }

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO) {
        orderValidator.validateOrderRequest(orderRequestDTO);

        Order order = orderMapper.toEntity(orderRequestDTO);
        return orderMapper.toDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderResponseDTO update(String id, OrderRequestDTO orderRequestDTO) {
        Order order = findOrderById(id);

        order.setUpdateDate(LocalDate.now());
        if(orderRequestDTO.getName() != null && !orderRequestDTO.getName().isEmpty()) {
            order.setName(orderRequestDTO.getName());
        }

        if(orderRequestDTO.getPhone() != null && !orderRequestDTO.getPhone().isEmpty()) {
            order.setPhone(orderRequestDTO.getPhone());
        }

        if(orderRequestDTO.getStatus() != null && !orderRequestDTO.getStatus().isEmpty()) {
            order.setStatus(orderRequestDTO.getStatus());
        }

        return orderMapper.toDTO(orderRepository.save(order));
    }

    @Transactional
    public void delete(String id) {
        Order order = findOrderById(id);
        orderRepository.delete(order);
    }
}
