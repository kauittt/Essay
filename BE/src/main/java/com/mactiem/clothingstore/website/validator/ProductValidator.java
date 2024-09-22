package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ProductValidator {
    // Validate the basic details of the product
    public void validateProductRequest(ProductRequestDTO productRequestDTO) {
        validateProductName(productRequestDTO.getName());
        validateProductDescription(productRequestDTO.getDescription());
        validateProductPrice(productRequestDTO.getPrice());
        validateProductImage(productRequestDTO.getImage());
        validateProductCategory(productRequestDTO.getCategory());
        validateProductStock(productRequestDTO.getStock());
    }

    public void validateUpdate(ProductRequestDTO productRequestDTO) {
        if (productRequestDTO.getPrice() != null) {
            validateProductPrice(productRequestDTO.getPrice());
        }

        if (productRequestDTO.getStock() != null) {
            validateProductStock(productRequestDTO.getStock());
        }
    }

    // Validate product name
    public void validateProductName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }
    }

    // Validate product description
    public void validateProductDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product description is required");
        }
    }

    // Validate product price
    public void validateProductPrice(Double price) {
        if (price == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product price is required");
        } else if (price <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product price must be positive");
        }
    }

    // Validate product image
    public void validateProductImage(String image) {
        if (image == null || image.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product image is required");
        }
    }

    // Validate product category
    public void validateProductCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product category is required");
        }
    }

    // Validate product stock
    public void validateProductStock(Integer stock) {
        if (stock == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product stock is required");
        } else if (stock <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product stock must be positive");
        }
    }
}
