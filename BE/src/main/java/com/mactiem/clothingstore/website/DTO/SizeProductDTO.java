package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SizeProductDTO {
    private SizeDTO size;
    private int stock;
    private LocalDate updateDate;
}
