package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class CategoryProductsDTO {
    private String category;
    private List<ProductResponseDTO> products;
}
