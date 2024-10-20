package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedBackResponseDTO {
    private Long id;
    private LocalDate createDate;
    private LocalDate updateDate;
    private Double point;
    private String description;
    private String user;
//    private Product product;
}
