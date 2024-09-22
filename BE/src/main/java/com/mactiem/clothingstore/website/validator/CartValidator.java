package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class CartValidator {
    private final ProductService productService;

    @Autowired
    public CartValidator(ProductService productService) {
        this.productService = productService;
    }

    public void validateCartRequest(CartRequestDTO cartRequestDTO) {
        if (cartRequestDTO.getProducts() == null || cartRequestDTO.getProducts().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot be empty");
        }

        if (cartRequestDTO.getQuantities() == null || cartRequestDTO.getQuantities().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list cannot be empty");
        }

        if (cartRequestDTO.getProducts().size() != cartRequestDTO.getQuantities().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatch between product IDs and quantities");
        }

        for (String quantity : cartRequestDTO.getQuantities()) {
            try {
                int qty = Integer.parseInt(quantity);
                //- Update thì quantity có thểm Âm/Dương
                if (qty == 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be zero");
                }
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format");
            }
        }
    }

    public void validateProductIdsExist(List<String> productIds) {
        List<Product> products = productService.findProductsByIds(productIds);
        if (products.size() != productIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
        }
    }
}
