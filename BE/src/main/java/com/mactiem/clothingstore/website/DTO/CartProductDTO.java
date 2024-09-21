package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartProductDTO {
    private ProductResponseDTO product;
    private int quantity;
}
