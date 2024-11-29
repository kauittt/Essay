package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BannerResponseDTO {
    private Long id;
    private String path;
    private UserResponseDTO user;
}
