package com.mactiem.clothingstore.website.DTO;

import lombok.*;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackRequestDTO {
    //    private String id;
//    private LocalDate createDate;
    private Double point;
    private String description;
    private String user;
    private String product;
}
