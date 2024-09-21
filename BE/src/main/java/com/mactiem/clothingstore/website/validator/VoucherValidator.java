package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class VoucherValidator {
    public void validateVoucherRequest(VoucherRequestDTO voucherRequestDTO) {
        if (voucherRequestDTO.getName() == null || voucherRequestDTO.getName().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher name is required");
        }

        if (voucherRequestDTO.getDiscountPercentage() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount percentage is required");
        } else if (voucherRequestDTO.getDiscountPercentage() <= 0 || voucherRequestDTO.getDiscountPercentage() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount percentage must be positive and not exceed 100");
        }

        if (voucherRequestDTO.getStartDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date is required");
        }

        if (voucherRequestDTO.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date is required");
        }

        if (voucherRequestDTO.getEndDate().isBefore(voucherRequestDTO.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }

        if (voucherRequestDTO.getQuantity() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity is required");
        } else if (voucherRequestDTO.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be positive");
        }

        if (voucherRequestDTO.getProducts() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Products is required");
        }
    }
}
