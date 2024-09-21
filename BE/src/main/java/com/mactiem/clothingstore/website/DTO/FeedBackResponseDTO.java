package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackResponseDTO {
    private String id;
    private LocalDate createDate;
    private Double point;
    private String description;
    private String user;
//    private Product product;
}
