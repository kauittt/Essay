package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.CartMapper;
import com.mactiem.clothingstore.website.repository.CartRepository;
import com.mactiem.clothingstore.website.validator.CartValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final CartValidator cartValidator;
    private final ProductService productService;

    @Autowired
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

        cartRepository.deleteProductsByCartId(cart.getId());

        return cartMapper.toDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO updateCartByUserId(String id, CartRequestDTO cartRequestDTO) {
        cartValidator.validateCartRequest(cartRequestDTO);
        cartValidator.validateProductIdsExist(cartRequestDTO.getProducts());

        Cart cart = findCartByUserId(id);

        List<String> productIds = cartRequestDTO.getProducts();
        List<String> quantities = cartRequestDTO.getQuantities();

        Map<String, Integer> requestedQuantities = new HashMap<>();
        for (int i = 0; i < productIds.size(); i++) {
            requestedQuantities.put(productIds.get(i), Integer.parseInt(quantities.get(i)));
        }

        List<Product> products = productService.findProductsByIds(productIds);

        for (Product product : products) {
            CartProduct existingCartProduct = cart.getCartProducts().stream()
                    .filter(cp -> cp.getProduct().getId().equals(product.getId()))
                    .findFirst()
                    .orElse(null);

            //- Đã tồn tại
            if (existingCartProduct != null) {
                int updatedQuantity = existingCartProduct.getQuantity() + requestedQuantities.get(product.getId());
                if (updatedQuantity > 0) {
                    existingCartProduct.setQuantity(updatedQuantity);
                }
                //- Remove khi <= 0
                else {
                    cart.getCartProducts().remove(existingCartProduct);
                }
            }
            //- Thêm mới
            else {
                if (requestedQuantities.get(product.getId()) < 0) {
                    throw new IllegalArgumentException("Quantity cannot be negative for new product: " + product.getId());
                }
                CartProductId cartProductId = new CartProductId(cart.getId(), product.getId());
                CartProduct newCartProduct = new CartProduct(cartProductId, cart, product, requestedQuantities.get(product.getId()));
                cart.getCartProducts().add(newCartProduct);
            }
        }

        return cartMapper.toDTO(cartRepository.save(cart));
    }
}
