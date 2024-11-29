package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryRequestDTO {
    private String name;
    private String enName;
}
