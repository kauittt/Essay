package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private List<CartProductDTO> cartProducts;
}
