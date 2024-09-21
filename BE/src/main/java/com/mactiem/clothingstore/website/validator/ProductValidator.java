package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ProductValidator {
    public void validateProductRequest(ProductRequestDTO productRequestDTO) {
        if (productRequestDTO.getName() == null || productRequestDTO.getName().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }

        if (productRequestDTO.getDescription() == null || productRequestDTO.getDescription().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product description is required");
        }

        if (productRequestDTO.getPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product price is required");
        } else if (productRequestDTO.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product price must be positive");
        }

        if (productRequestDTO.getImage() == null || productRequestDTO.getImage().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product image is required");
        }

        if (productRequestDTO.getCategory() == null || productRequestDTO.getCategory().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product category is required");
        }

        if (productRequestDTO.getStock() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product stock is required");
        } else if (productRequestDTO.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product stock must be positive");
        }
    }
}
