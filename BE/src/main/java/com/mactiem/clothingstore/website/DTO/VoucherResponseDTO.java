package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Product;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponseDTO {
    private String id;
    private List<ProductResponseDTO> products;
    private Double discountPercentage;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
}
