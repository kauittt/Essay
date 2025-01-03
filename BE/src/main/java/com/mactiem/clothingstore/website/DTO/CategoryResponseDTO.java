package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String enName;
    private List<ProductResponseDTO> products;
}
