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
        cartValidator.validateCartRequest(cartRequestDTO); // Ensure the request is valid

        Cart cart = findCartByUserId(userId); // Fetch the cart associated with the user

        List<String> productIds = cartRequestDTO.getProducts();
        List<String> quantities = cartRequestDTO.getQuantities();
        List<String> sizes = cartRequestDTO.getSizes(); // Sizes for the products

        Map<Long, Integer> requestedQuantities = new HashMap<>();
        Map<Long, String> requestedSizes = new HashMap<>();

        // Prepare maps of requested quantities and sizes
        for (int i = 0; i < productIds.size(); i++) {
            Long productId = Long.valueOf(productIds.get(i));
            requestedQuantities.put(productId, Integer.parseInt(quantities.get(i)));
            requestedSizes.put(productId, sizes.get(i));
        }

        List<Product> products = productService.findProductsByIds(productIds);

        for (Product product : products) {
            Long productId = product.getId();
            String size = requestedSizes.get(productId); // Get size for the product

            //* Filter existing cart products by product ID and size
            Optional<CartProduct> existingCartProductOpt = cart.getCartProducts().stream()
                    .filter(cp -> cp.getProduct().getId().equals(productId) && cp.getId().getSize().equals(size))
                    .findFirst();

            if (existingCartProductOpt.isPresent()) {
                CartProduct existingCartProduct = existingCartProductOpt.get();
                int updatedQuantity = existingCartProduct.getQuantity() + requestedQuantities.get(productId);
                if (updatedQuantity <= 0) {
                    cart.getCartProducts().remove(existingCartProduct); // Remove product if quantity is 0 or less
                } else {
                    existingCartProduct.setQuantity(updatedQuantity); // Update the quantity
                }
            } else {
                int quantityToAdd = requestedQuantities.get(productId);
                if (quantityToAdd > 0) {
                    CartProduct newCartProduct = new CartProduct(
                            new CartProductId(cart.getId(), productId, size),
                            cart,
                            product,
                            quantityToAdd
                    );
                    cart.getCartProducts().add(newCartProduct); // Add new product
                } else {
                    throw new IllegalArgumentException("Quantity cannot be negative for new product: " + productId);
                }
            }
        }

        return cartMapper.toDTO(cartRepository.save(cart));
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
//        Map<Long, Integer> requestedQuantities = new HashMap<>();
//        Map<Long, String> requestedSizes = new HashMap<>();
//
//        // Prepare maps of requested quantities and sizes
//        for (int i = 0; i < productIds.size(); i++) {
//            Long productId = Long.valueOf(productIds.get(i));
//            requestedQuantities.put(productId, Integer.parseInt(quantities.get(i)));
//            requestedSizes.put(productId, sizes.get(i));
//        }
//
//        List<Product> products = productService.findProductsByIds(productIds);
//
//        for (Product product : products) {
//            Long productId = product.getId();
//            //* Filter existing cart products not only by product but also check sizes
//            CartProduct existingCartProduct = cart.getCartProducts().stream()
//                    .filter(cp -> cp.getProduct().getId().equals(productId) && cp.getSize().equals(requestedSizes.get(productId)))
//                    .findFirst()
//                    .orElse(null);
//
//            //* Update existing cart product or add new one
//            if (existingCartProduct != null) {
//                int updatedQuantity = existingCartProduct.getQuantity() + requestedQuantities.get(productId);
//                existingCartProduct.setQuantity(updatedQuantity);
//                if (updatedQuantity <= 0) {
//                    cart.getCartProducts().remove(existingCartProduct); // Remove product if quantity is 0 or less
//                }
//            } else {
//                //* Check if adding a new product with negative quantity, which should not be allowed
//                int quantityToAdd = requestedQuantities.get(productId);
//                if (quantityToAdd > 0) {
//                    CartProduct newCartProduct = new CartProduct(new CartProductId(cart.getId(), productId), cart, product, quantityToAdd, requestedSizes.get(productId));
//                    cart.getCartProducts().add(newCartProduct);
//                } else {
//                    throw new IllegalArgumentException("Quantity cannot be negative for new product: " + productId);
//                }
//            }
//        }
//
//        // Save the updated cart and map it to the response DTO
//        return cartMapper.toDTO(cartRepository.save(cart));
//    }
}
