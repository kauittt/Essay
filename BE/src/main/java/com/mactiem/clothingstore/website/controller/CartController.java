package com.mactiem.clothingstore.website.controller;

import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/carts")
public class CartController {
    private final CartService cartService;

    @Autowired
    @Lazy
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PutMapping("/clean/{id}")
    public ResponseEntity<?> cleanCartByUserId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(cartService.cleanCartByUserId(id));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartByUserId(@PathVariable String id, @RequestBody CartRequestDTO cartDTO) {
        try {
            CartResponseDTO updatedCart = cartService.updateCartByUserId(id, cartDTO);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
