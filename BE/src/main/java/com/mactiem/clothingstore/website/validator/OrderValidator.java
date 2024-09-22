package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class OrderValidator {
    private final ProductService productService;
    private final UserService userService;

    @Autowired
    public OrderValidator(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    public void validateUpdate(OrderRequestDTO orderRequestDTO) {
        if (orderRequestDTO.getPhone() != null) {
            validatePhone(orderRequestDTO.getPhone());
        }
    }


    // Validate the basic details of the order
    public void validateOrderRequest(OrderRequestDTO orderRequestDTO) {
        validateUser(orderRequestDTO.getUser());
        validateProducts(orderRequestDTO.getProducts());
        validateQuantities(orderRequestDTO.getQuantities(), orderRequestDTO.getProducts().size());
        validateName(orderRequestDTO.getName());
        validatePhone(orderRequestDTO.getPhone());
        validateAddress(orderRequestDTO.getAddress());
        validateStatus(orderRequestDTO.getStatus());
    }

    // Validate user
    public void validateUser(String user) {
        if (user == null || user.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be empty");
        }

        userService.findUserById(user);
    }

    // Validate product list
    public void validateProducts(List<String> products) {
        if (products == null || products.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot be empty");
        }

        List<Product> dbProducts = productService.findProductsByIds(products);
        if (products.size() != dbProducts.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
        }
    }

    // Validate quantities
    public void validateQuantities(List<String> quantities, int expectedSize) {
        if (quantities == null || quantities.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list cannot be empty");
        }

        for (String quantity : quantities) {
            try {
                int qty = Integer.parseInt(quantity);
                if (qty <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be negative or zero");
                }
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format");
            }
        }

        if (quantities.size() != expectedSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list must match the number of products");
        }
    }

    public void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be empty");
        }
    }

    public void validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number cannot be empty");
        }

        String phonePattern = "^0[0-9]{9}$";
        if (!Pattern.matches(phonePattern, phone)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid phone format");
        }
    }

    public void validateAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address cannot be empty");
        }
    }

    public void validateStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status cannot be empty");
        }
    }
}
