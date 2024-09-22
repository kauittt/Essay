package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Voucher;
import com.mactiem.clothingstore.website.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Component
public class VoucherValidator {
    private final ProductService productService;

    @Autowired
    public VoucherValidator(ProductService productService) {
        this.productService = productService;
    }

    public void validateForUpdate(VoucherRequestDTO voucherRequestDTO, Voucher voucher) {
        if (voucherRequestDTO.getDiscountPercentage() != null) {
            validateDiscountPercentage(voucherRequestDTO.getDiscountPercentage());
        }

        if (voucherRequestDTO.getEndDate() != null) {
            validateDateRange(voucher.getStartDate(), voucherRequestDTO.getEndDate());
        }

        if (voucherRequestDTO.getQuantity() != null) {
            validateQuantity(voucherRequestDTO.getQuantity());
        }

        if (voucherRequestDTO.getProducts() != null) {
            validateProducts(voucherRequestDTO.getProducts());
        }
    }

    // Validate the basic details of the voucher
    public void validateVoucherRequest(VoucherRequestDTO voucherRequestDTO) {
        validateName(voucherRequestDTO.getName());
        validateDiscountPercentage(voucherRequestDTO.getDiscountPercentage());
        validateDateRange(voucherRequestDTO.getStartDate(), voucherRequestDTO.getEndDate());
        validateQuantity(voucherRequestDTO.getQuantity());
        validateProducts(voucherRequestDTO.getProducts());
    }

    // Validate voucher name
    public void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher name is required");
        }
    }

    // Validate discount percentage
    public void validateDiscountPercentage(Double discountPercentage) {
        if (discountPercentage == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount percentage is required");
        } else if (discountPercentage <= 0 || discountPercentage > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount percentage must be positive and not exceed 100");
        }
    }

    // Validate start and end date
    public void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date is required");
        }
        if (endDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date is required");
        }
        if (endDate.isBefore(startDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }

    // Validate quantity
    public void validateQuantity(Integer quantity) {
        if (quantity == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity is required");
        } else if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be positive");
        }
    }

    // Validate product list association
    public void validateProducts(List<String> products) {
        if (products == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Products is required");
        }

        if (!products.isEmpty()) {
            List<Product> dbProducts = productService.findProductsByIds(products);
            if (dbProducts.size() != products.size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
            }
        }
    }
}
