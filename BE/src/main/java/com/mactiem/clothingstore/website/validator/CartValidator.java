package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.entity.Product;
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

        // Lấy danh sách sản phẩm từ productService
        List<Product> products = validateProductIdsExist(cartRequestDTO.getProducts());

        // Map để lưu trữ thông tin sản phẩm và tồn kho (stock)
        Map<String, Integer> productStockMap = new HashMap<>();
        for (Product product : products) {
            productStockMap.put(product.getId(), product.getStock());
        }

        // Duyệt qua danh sách quantity để validate
        for (int i = 0; i < cartRequestDTO.getProducts().size(); i++) {
            String productId = cartRequestDTO.getProducts().get(i);
            String quantityStr = cartRequestDTO.getQuantities().get(i);

            try {
                int quantity = Integer.parseInt(quantityStr);

                if (quantity == 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be zero");
                }

                // Kiểm tra quantity có lớn hơn stock của product không
                Integer stock = productStockMap.get(productId);
                if (stock != null && quantity > stock) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Quantity for product ID " + productId + " exceeds available stock. Available stock: " + stock);
                }

            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity format");
            }
        }
    }

    public List<Product> validateProductIdsExist(List<String> productIds) {
        List<Product> products = productService.findProductsByIds(productIds);
        if (products.size() != productIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more product IDs do not exist");
        }

        return products;
    }
}
