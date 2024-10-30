package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Size;
import com.mactiem.clothingstore.website.entity.SizeProduct;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.repository.SizeRepository;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Component
public class OrderValidator {
    private final ProductService productService;
    private final UserService userService;
    private final SizeRepository sizeRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderValidator(ProductService productService, UserService userService, SizeRepository sizeRepository, ProductRepository productRepository) {
        this.productService = productService;
        this.userService = userService;
        this.sizeRepository = sizeRepository;
        this.productRepository = productRepository;
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
        validateSizes(orderRequestDTO.getSizes(), orderRequestDTO.getProducts().size());
        validateQuantities(orderRequestDTO.getQuantities(), orderRequestDTO.getProducts().size());
        validateQuantitiesDoNotExceedStock(orderRequestDTO.getProducts(), orderRequestDTO.getQuantities(), orderRequestDTO.getSizes());

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

    public void validateSizes(List<String> sizes, int expectedSize) {
        if (sizes == null || sizes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product sizes list cannot be empty");
        }

        List<Size> dbSizes = sizeRepository.findByNameIn(sizes);
        if (sizes.size() != dbSizes.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product's Size IDs do not exist");
        }

        if (dbSizes.size() != expectedSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sizes list must match the number of products");
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

    private void validateQuantitiesDoNotExceedStock(List<String> productIds, List<String> quantities, List<String> sizes) {
        List<Product> products = productService.findProductsByIds(productIds);
        Map<Long, Integer> productStockMap = new HashMap<>();
        int count = 0;
        for (Product product : products) {
            for (SizeProduct sizeProduct : product.getSizeProducts()) {
                if (sizeProduct.getSize().getName().equals(sizes.get(count++))) {
                    productStockMap.put(product.getId(), sizeProduct.getStock());
                }
            }
        }

        for (int i = 0; i < productIds.size(); i++) {
            long productId = Long.valueOf(productIds.get(i));
            int quantityStr = Integer.parseInt(quantities.get(i));
            String size = sizes.get(i);

            try {
                Integer stock = productStockMap.get(productId);

                if (stock != null && quantityStr > stock) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            String.format("Quantity for product ID: %d, size: %s exceeds available stock. Available stock: %d", productId, size, stock));
                }
            } catch (NumberFormatException e) {
                // This exception should already be handled in validateQuantities, but it's good to have a fallback
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format for product ID " + productId);
            }
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
