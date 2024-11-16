package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.CartMapper;
import com.mactiem.clothingstore.website.repository.CartRepository;
import com.mactiem.clothingstore.website.validator.CartValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final CartValidator cartValidator;
    private final ProductService productService;

    @Autowired
    @Lazy
    public CartService(CartMapper cartMapper, CartRepository cartRepository, CartValidator cartValidator, ProductService productService) {
        this.cartMapper = cartMapper;
        this.cartRepository = cartRepository;
        this.cartValidator = cartValidator;
        this.productService = productService;
    }

    //- Helper
    public Cart findCartByUserId(String id) {
        return cartRepository.findCartByUserId(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Cart", id)));
    }

    @Transactional
    public CartResponseDTO cleanCartByUserId(String id) {
        Cart cart = findCartByUserId(id);

        cartRepository.deleteProductsByCartId(String.valueOf(cart.getId()));

        return cartMapper.toDTO(cartRepository.save(cart));
    }


    @Transactional
    public CartResponseDTO updateCartByUserId(String userId, CartRequestDTO cartRequestDTO) {
        // Xác thực request
        validateCartRequest(cartRequestDTO);

        // Lấy thông tin giỏ hàng và sản phẩm
        Cart cart = findCartByUserId(userId);
        List<Product> products = productService.findProductsByIds(cartRequestDTO.getProducts());

        // Xử lý các sản phẩm trong yêu cầu
        processCartProducts(cart, products, cartRequestDTO);

        // Lưu cart và trả về kết quả
        return cartMapper.toDTO(cartRepository.save(cart));
    }

    // Xác thực request
    private void validateCartRequest(CartRequestDTO cartRequestDTO) {
        cartValidator.validateCartRequest(cartRequestDTO);
    }

    // Xử lý từng sản phẩm
    private void processCartProducts(Cart cart, List<Product> products, CartRequestDTO cartRequestDTO) {
        for (int i = 0; i < cartRequestDTO.getProducts().size(); i++) {
            Long productId = Long.valueOf(cartRequestDTO.getProducts().get(i));
            int quantity = Integer.parseInt(cartRequestDTO.getQuantities().get(i));
            String size = cartRequestDTO.getSizes().get(i);

            // Tìm sản phẩm trong danh sách
            Product product = findProductById(products, productId);

            // Xử lý sản phẩm (cập nhật hoặc thêm mới)
            processSingleProduct(cart, product, productId, size, quantity);
        }
    }

    // Tìm sản phẩm theo ID
    private Product findProductById(List<Product> products, Long productId) {
        return products.stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + productId + " not found in the provided product list."));
    }

    // Xử lý một sản phẩm cụ thể
    private void processSingleProduct(Cart cart, Product product, Long productId, String size, int quantity) {
        // Kiểm tra sản phẩm hiện tại trong giỏ hàng
        Optional<CartProduct> existingCartProductOpt = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId) && cp.getId().getSize().equals(size))
                .findFirst();

        if (existingCartProductOpt.isPresent()) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            updateExistingProduct(cart, existingCartProductOpt.get(), quantity);
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới
            addNewProduct(cart, product, productId, size, quantity);
        }
    }

    // Cập nhật số lượng sản phẩm đã có
    private void updateExistingProduct(Cart cart, CartProduct existingCartProduct, int quantity) {
        int updatedQuantity = existingCartProduct.getQuantity() + quantity;
        if (updatedQuantity <= 0) {
            cart.getCartProducts().remove(existingCartProduct); // Xóa nếu số lượng <= 0
        } else {
            existingCartProduct.setQuantity(updatedQuantity); // Cập nhật số lượng
        }
    }

    // Thêm sản phẩm mới
    private void addNewProduct(Cart cart, Product product, Long productId, String size, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity cannot be negative for new product: " + productId);
        }
        CartProduct newCartProduct = new CartProduct(
                new CartProductId(cart.getId(), productId, size),
                cart,
                product,
                quantity
        );
        cart.getCartProducts().add(newCartProduct); // Thêm sản phẩm mới
    }
//    @Transactional
//    public CartResponseDTO updateCartByUserId(String userId, CartRequestDTO cartRequestDTO) {
//        cartValidator.validateCartRequest(cartRequestDTO); // Ensure the request is valid
//
//        Cart cart = findCartByUserId(userId); // Fetch the cart associated with the user
//
//        List<String> productIds = cartRequestDTO.getProducts();
//        List<String> quantities = cartRequestDTO.getQuantities();
//        List<String> sizes = cartRequestDTO.getSizes(); // Sizes for the products
//
//        List<Product> products = productService.findProductsByIds(productIds);
//
//        for (int i = 0; i < cartRequestDTO.getProducts().size(); i++) {
//            Long id = Long.valueOf(cartRequestDTO.getProducts().get(i));
//            int quantity = Integer.parseInt(cartRequestDTO.getQuantities().get(i));
//            String size = cartRequestDTO.getSizes().get(i);
//
//            Optional<Product> productOpt = products.stream().filter(p -> p.getId().equals(id)).findFirst();
//
//            if (productOpt.isEmpty()) {
//                throw new IllegalArgumentException("Product with ID " + id + " not found in the provided product list.");
//            }
//            Product product = productOpt.get();
//
//            //* Filter existing cart products by product ID and size
//            Optional<CartProduct> existingCartProductOpt = cart.getCartProducts().stream()
//                    .filter(cp -> cp.getProduct().getId().equals(id) && cp.getId().getSize().equals(size))
//                    .findFirst();
//
//            if (existingCartProductOpt.isPresent()) {
//                CartProduct existingCartProduct = existingCartProductOpt.get();
//                int updatedQuantity = existingCartProduct.getQuantity() + quantity;
//                if (updatedQuantity <= 0) {
//                    cart.getCartProducts().remove(existingCartProduct); // Remove product if quantity is 0 or less
//                } else {
//                    existingCartProduct.setQuantity(updatedQuantity); // Update the quantity
//                }
//            } else {
//                //* Add to cart
//                if (quantity > 0) {
//                    CartProduct newCartProduct = new CartProduct(
//                            new CartProductId(cart.getId(), id, size),
//                            cart,
//                            product,
//                            quantity
//                    );
//                    cart.getCartProducts().add(newCartProduct); // Add new product
//                } else {
//                    throw new IllegalArgumentException("Quantity cannot be negative for new product: " + id);
//                }
//            }
//        }
//
//        return cartMapper.toDTO(cartRepository.save(cart));
//    }
}
