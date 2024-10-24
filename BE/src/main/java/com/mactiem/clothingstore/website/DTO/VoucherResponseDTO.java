package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Product;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponseDTO {
    private Long id;
    private List<ProductResponseDTO> products;
    private Double discountPercentage;
    private String name;
    private String enName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;


    public List<ProductResponseDTO> getProducts() {
        if (products == null) {
            products = new ArrayList<>();
        }
        return products;
    }
}
