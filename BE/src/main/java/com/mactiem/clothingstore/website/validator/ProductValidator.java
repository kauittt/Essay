package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Size;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.repository.SizeRepository;
import com.mactiem.clothingstore.website.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class ProductValidator {
    private ProductRepository productRepository;
    private CategoryService categoryService;
    private final SizeRepository sizeRepository;

    @Autowired
    public ProductValidator(ProductRepository productRepository, CategoryService categoryService,
                            SizeRepository sizeRepository) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.sizeRepository = sizeRepository;
    }

    // Validate the basic details of the product
    public void validateProductRequest(ProductRequestDTO productRequestDTO) {
        validateProductName(productRequestDTO.getName());
        validateProductDescription(productRequestDTO.getDescription());

        validateProductEnName(productRequestDTO.getEnName());
        validateProductEnDescription(productRequestDTO.getEnDescription());

        validateProductPrice(productRequestDTO.getPrice());
        validateProductImage(productRequestDTO.getImage());
        validateProductCategory(productRequestDTO.getCategories());
        validateProductStock(productRequestDTO.getStock());

        validateSizes(productRequestDTO.getSizes());
        validateQuantities(productRequestDTO.getQuantities(), productRequestDTO.getSizes().size());
    }

    public void validateUpdate(ProductRequestDTO productRequestDTO) {
        if (productRequestDTO.getPrice() != null) {
            validateProductPrice(productRequestDTO.getPrice());
        }

        if (productRequestDTO.getStock() != null) {
            validateProductStock(productRequestDTO.getStock());
        }

        if (productRequestDTO.getCategories() != null) {
            validateProductCategory(productRequestDTO.getCategories());
        }

        if (productRequestDTO.getSizes() != null) {
            validateSizes(productRequestDTO.getSizes());
            validateQuantities(productRequestDTO.getQuantities(), productRequestDTO.getSizes().size());
        }
    }

    public void validateSizes(List<String> sizes) {
        if (sizes == null || sizes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product sizes cannot be empty");
        }

        List<Size> dbSizes = sizeRepository.findByNameIn(sizes);
        if (sizes.size() != dbSizes.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more size-name do not exist");
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
//                if (qty <= 0) {
//                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be negative or zero");
//                }
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format");
            }
        }

        if (quantities.size() != expectedSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantities list must match the number of products");
        }
    }

    // Validate product name
    public void validateProductName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }
        if (productRepository.findProductByName(name).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product name already exists");
        }
    }

    public void validateProductEnName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product  en-name is required");
        }
        if (productRepository.findByEnName(name).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product en-name already exists");
        }
    }

    // Validate product description
    public void validateProductDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product description is required");
        }
    }

    public void validateProductEnDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product en-description is required");
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
    public void validateProductCategory(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categories cannot be null or empty");
        }
        List<Category> dbCategories = categoryService.findAllByNames(categories);
        if (categories.size() != dbCategories.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not all categories are found");
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
