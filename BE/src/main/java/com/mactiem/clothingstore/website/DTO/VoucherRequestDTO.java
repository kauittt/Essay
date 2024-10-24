package com.mactiem.clothingstore.website.DTO;


import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoucherRequestDTO {
    private List<String> products = new ArrayList<>();
    private Double discountPercentage; //- input: 10 -> save: 0.1
    private String name;
    private String enName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
}
