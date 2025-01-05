package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Voucher;
import com.mactiem.clothingstore.website.repository.VoucherRepository;
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
    private final VoucherRepository voucherRepository;

    @Autowired
    public VoucherValidator(ProductService productService, VoucherRepository voucherRepository) {
        this.productService = productService;
        this.voucherRepository = voucherRepository;
    }

    public void validateForUpdate(VoucherRequestDTO voucherRequestDTO, Voucher voucher) {
//        if (voucherRequestDTO.getName() != null) {
//            validateName(voucherRequestDTO.getName());
//        }

        if (voucherRequestDTO.getDiscountPercentage() != null) {
            validateDiscountPercentage(voucherRequestDTO.getDiscountPercentage());
        }

        if (voucherRequestDTO.getMaxDiscount() != null) {
            validateMaxDiscount(voucherRequestDTO.getMaxDiscount());
        }

        if (voucherRequestDTO.getMinRequire() != null) {
            validateMinRequire(voucherRequestDTO.getMinRequire());
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
        validateMaxDiscount(voucherRequestDTO.getMaxDiscount());
        validateMinRequire(voucherRequestDTO.getMinRequire());
        validateDateRange(voucherRequestDTO.getStartDate(), voucherRequestDTO.getEndDate());
        validateQuantity(voucherRequestDTO.getQuantity());
        validateProducts(voucherRequestDTO.getProducts());
    }

    // Validate voucher name
    public void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher name is required");
        }
        if (voucherRepository.findVoucherByName(name).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Voucher name already exists");
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

    public void validateMaxDiscount(Double maxDiscount) {
        if (maxDiscount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max discount is required");
        } else if (maxDiscount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max discount must be positive");
        }
    }

    public void validateMinRequire(Double minRequire) {
        if (minRequire == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max discount is required");
        } else if (minRequire < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max discount must be positive");
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
        } else if (quantity < 0) {
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
