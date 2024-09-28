package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequestDTO {
    private String name;
    private String description;
    private Double price;
    private String image;
    private String category;
    private Integer stock;
}
