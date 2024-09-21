package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Product;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoucherRequestDTO {
    private String name;
    private Double discountPercentage; //- input: 10 -> save: 0.1
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
    private List<String> products;  //- empty = all
}
