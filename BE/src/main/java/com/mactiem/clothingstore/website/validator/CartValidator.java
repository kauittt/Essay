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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        // Lấy danh sách sản phẩm từ productService
        List<Product> products = validateProductIdsExist(cartRequestDTO.getProducts());

        // Map để lưu trữ thông tin sản phẩm và tồn kho (stock)
        Map<String, Integer> productStockMap = new HashMap<>();
        List<String> sizes = cartRequestDTO.getSizes();
        int count = 0;

        for (Product product : products) {
            for (SizeProduct sizeProduct : product.getSizeProducts()) {
                if (sizeProduct.getSize().getName().equals(sizes.get(count))) {
                    productStockMap.put(String.valueOf(product.getId()), sizeProduct.getStock());
                }
            }
            count++;
//            productStockMap.put(String.valueOf(product.getId()), product.getStock());
        }



        // Duyệt qua danh sách quantity để validate
        for (int i = 0; i < cartRequestDTO.getProducts().size(); i++) {
            String productId = cartRequestDTO.getProducts().get(i);
            String quantityStr = cartRequestDTO.getQuantities().get(i);
            String size = cartRequestDTO.getSizes().get(i);

            try {
                int quantity = Integer.parseInt(quantityStr);

                if (quantity == 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be zero");
                }

                // Kiểm tra quantity có lớn hơn stock của product không
                Integer stock = productStockMap.get(productId);
                if (stock != null && quantity > stock) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            String.format("Quantity for product ID: %s, size: %s exceeds available stock. Available stock: %d", productId, size, stock));
                }

            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format");
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
