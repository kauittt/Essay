package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartRequestDTO {
    private List<String> sizes;
    private List<String> products;
    private List<String> quantities;
}
