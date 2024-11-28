package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.*;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.OrderMapper;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.repository.OrderRepository;
import com.mactiem.clothingstore.website.security.SecurityUtils;
import com.mactiem.clothingstore.website.validator.OrderValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cglib.core.Local;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;
    private final ProductService productService;
    private final InvoiceService invoiceService;

    @Autowired
    @Lazy
    public OrderService(OrderMapper orderMapper, OrderRepository orderRepository
            , OrderValidator orderValidator, ProductService productService, InvoiceService invoiceService) {
        this.orderMapper = orderMapper;
        this.orderRepository = orderRepository;
        this.orderValidator = orderValidator;
        this.invoiceService = invoiceService;
        this.productService = productService;
    }

    //* Helper
    public Order findOrderById(String id) {
        return orderRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Order", id)));
    }

    public Order findOrderByIdAndUserId(String id, String userId) {
        return orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Order", id)));
    }

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    //* Methods
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
        order.setCreateDate(LocalDateTime.now());
        order.setUpdateDate(LocalDateTime.now());
        orderMapper.mapOrderProductsEntity(order, orderRequestDTO, productService);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toDTO(savedOrder);
    }

    @Transactional
    public OrderResponseDTO update(String id, OrderRequestDTO orderRequestDTO) {
        Order order = findOrderById(id);

        if (order.getStatus().equals("DONE") || order.getStatus().equals("CANCEL")) return null;

        orderValidator.validateUpdate(orderRequestDTO);

        if (orderRequestDTO.getName() != null && !orderRequestDTO.getName().isEmpty()) {
            order.setName(orderRequestDTO.getName());
        }

        if (orderRequestDTO.getPhone() != null && !orderRequestDTO.getPhone().isEmpty()) {
            order.setPhone(orderRequestDTO.getPhone());
        }

        if (orderRequestDTO.getStatus() != null && !orderRequestDTO.getStatus().isEmpty()) {
            order.setStatus(orderRequestDTO.getStatus());

            if (orderRequestDTO.getStatus().equals("CANCEL")) {
                handleCancel(order);
            }
        }

        order.setUpdateDate(LocalDateTime.now());
        return orderMapper.toDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderResponseDTO updateCurrent(String id, OrderRequestDTO orderRequestDTO) {
        String userId = SecurityUtils.getCurrentUserId();

        Order order = findOrderByIdAndUserId(id, userId);

        if (order.getStatus().equals("DONE") || order.getStatus().equals("CANCEL")) return null;


        orderValidator.validateUpdate(orderRequestDTO);

        if (orderRequestDTO.getName() != null && !orderRequestDTO.getName().isEmpty()) {
            order.setName(orderRequestDTO.getName());
        }

        if (orderRequestDTO.getPhone() != null && !orderRequestDTO.getPhone().isEmpty()) {
            order.setPhone(orderRequestDTO.getPhone());
        }

        if (orderRequestDTO.getStatus() != null && !orderRequestDTO.getStatus().isEmpty()) {
            order.setStatus(orderRequestDTO.getStatus());

            if (orderRequestDTO.getStatus().equals("CANCEL")) {
                handleCancel(order);
            }
        }

        order.setUpdateDate(LocalDateTime.now());
        return orderMapper.toDTO(orderRepository.save(order));
    }


    private void handleCancel(Order order) {
        List<OrderProduct> orderProducts = order.getOrderProducts();
        for (OrderProduct orderProduct : orderProducts) {
            String size = orderProduct.getSize();
            int quantity = orderProduct.getQuantity();
            Product product = orderProduct.getProduct();

            Optional<SizeProduct> sizeProductOpt = product.getSizeProducts()
                    .stream()
                    .filter(sp -> sp.getSize().getName().equals(size))
                    .findFirst();

            if (sizeProductOpt.isPresent()) {
                SizeProduct sizeProduct = sizeProductOpt.get();
                sizeProduct.setStock(sizeProduct.getStock() + quantity);
                sizeProduct.setUpdateDate(LocalDate.now());
            }
        }
    }

    @Transactional
    public void delete(String id) {
        Order order = findOrderById(id);
        orderRepository.delete(order);
    }

    @Transactional
    public void deleteCurrnet(String id) {
        String userId = SecurityUtils.getCurrentUserId();
        Order order = findOrderByIdAndUserId(id, userId);
        orderRepository.delete(order);
    }
}
