package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Size;
import com.mactiem.clothingstore.website.entity.SizeProduct;
import com.mactiem.clothingstore.website.repository.SizeRepository;
import com.mactiem.clothingstore.website.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Component
public class CartValidator {
    private final ProductService productService;
    private final SizeRepository sizeRepository;

    @Autowired
    public CartValidator(ProductService productService, SizeRepository sizeRepository) {
        this.productService = productService;
        this.sizeRepository = sizeRepository;
    }

    public void validateCartRequest(CartRequestDTO cartRequestDTO) {
        validateRequired(cartRequestDTO);
        validateSizesExist(cartRequestDTO.getSizes());

        List<Product> products = validateProductIdsExist(cartRequestDTO.getProducts());
        
        for (int i = 0; i < cartRequestDTO.getProducts().size(); i++) {
            Long id = Long.valueOf(cartRequestDTO.getProducts().get(i));
            int quantity = Integer.parseInt(cartRequestDTO.getQuantities().get(i));
            String size = cartRequestDTO.getSizes().get(i);

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

    public void validateRequired(CartRequestDTO cartRequestDTO) {
        if (cartRequestDTO.getProducts() == null || cartRequestDTO.getProducts().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot be empty");
        }

        if (cartRequestDTO.getQuantities() == null || cartRequestDTO.getQuantities().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list cannot be empty");
        }

        if (cartRequestDTO.getSizes() == null || cartRequestDTO.getSizes().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sizes list cannot be empty");
        }

        if (cartRequestDTO.getProducts().size() != cartRequestDTO.getQuantities().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatch between Product IDs and quantities");
        }

        if (cartRequestDTO.getProducts().size() != cartRequestDTO.getSizes().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatch between Product IDs and Sizes");
        }
    }

    public List<Product> validateProductIdsExist(List<String> productIds) {
        List<Product> products = productService.findProductsByIds(productIds);

        //* Case 1 sp 3 size
//        if (products.size() != productIds.size()) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
//        }

        return products;
    }

    public void validateSizesExist(List<String> sizes) {
        List<Size> dbSize = sizeRepository.findByNameIn(sizes);

        //* 3 sp 1 size
//        if (dbSize.size() != sizes.size()) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more Size do not exist");
//        }

    }
}
