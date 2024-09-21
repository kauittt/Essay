package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class OrderValidator {
    private final ProductService productService;
    private final UserService userService;

    @Autowired
    public OrderValidator(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    // Validate the basic details of the order
    public void validateOrderRequest(OrderRequestDTO orderRequestDTO) {
        validateUser(orderRequestDTO.getUser());
        validateProducts(orderRequestDTO.getProducts());
        validateQuantities(orderRequestDTO.getQuantities(), orderRequestDTO.getProducts().size());
        validatePersonalInfo(orderRequestDTO.getName(), orderRequestDTO.getPhone(), orderRequestDTO.getAddress());
    }

    // Validate user
    private void validateUser(String user) {
        if (user == null || user.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be empty");
        }

        userService.findUserById(user);
    }

    // Validate product list
    private void validateProducts(List<String> products) {
        if (products == null || products.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot be empty");
        }

        List<Product> dbProducts = productService.findProductsByIds(products);
        if (products.size() != dbProducts.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
        }
    }

    // Validate quantities
    private void validateQuantities(List<String> quantities, int expectedSize) {
        if (quantities == null || quantities.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list cannot be empty");
        }
        if (quantities.size() != expectedSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list must match the number of products");
        }
    }

    // Validate personal information
    private void validatePersonalInfo(String name, String phone, String address) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be empty");
        }
        if (phone == null || phone.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number cannot be empty");
        }
        if (address == null || address.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address cannot be empty");
        }
    }
}
