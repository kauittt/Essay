package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequestDTO {
    private List<String> categories;
    private String name;
    private String description;
    private Integer stock;
    private Double price;
    private String image;
}
