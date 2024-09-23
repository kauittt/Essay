package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private List<CartProductDTO> cartProducts;

    public List<CartProductDTO> getCartProducts() {
        if (cartProducts == null) {
            cartProducts = new ArrayList<>();
        }
        return cartProducts;
    }
}
