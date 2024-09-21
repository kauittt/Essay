package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartRequestDTO {
    private List<String> products;
    private List<String> quantities;
}
