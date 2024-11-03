package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductDTO {
    private ProductResponseDTO product;
    private int quantity;
    private String size;
}
