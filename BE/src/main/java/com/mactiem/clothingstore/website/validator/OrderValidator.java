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

import java.util.*;
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
//        if (products.size() != dbProducts.size()) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
//        }
    }

    public void validateSizes(List<String> sizes, int expectedSize) {
        if (sizes == null || sizes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product sizes list cannot be empty");
        }

        if (sizes.size() != expectedSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sizes list must match the number of products");
        }

        //* Nếu 3 item cùng 1 size thì k check v đc
//        List<Size> dbSizes = sizeRepository.findByNameIn(sizes);
//        if (sizes.size() != dbSizes.size()) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product's Size IDs do not exist");
//        }


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

        for (int i = 0; i < productIds.size(); i++) {
            Long id = Long.valueOf(productIds.get(i));
            int quantity = Integer.parseInt(quantities.get(i));
            String size = sizes.get(i);

            Optional<Product> productOpt = products.stream().filter(p -> p.getId().equals(id)).findFirst();

            if (productOpt.isEmpty()) {
                throw new IllegalArgumentException("Product with ID " + id + " not found in the provided product list.");
            }
            Product product = productOpt.get();

            Optional<SizeProduct> sizeProductOpt = product.getSizeProducts().stream()
                    .filter(sp -> sp.getSize().getName().equals(size))
                    .findFirst();

            if (sizeProductOpt.isPresent()) {
                SizeProduct sizeProduct = sizeProductOpt.get();
                if (quantity > sizeProduct.getStock()) {
                    throw new IllegalArgumentException("Not enough stock for product ID: " + id + " and size: " + size);
                }
            } else {
                throw new NoSuchElementException("No size product found for product ID: " + id + " and size: " + size);
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
