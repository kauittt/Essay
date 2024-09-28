package com.mactiem.clothingstore.website.DTO;

import lombok.*;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedBackRequestDTO {
    //    private String id;
//    private LocalDate createDate;
//    private LocalDate updateDate;
    private Double point; //- update
    private String description; //- update
    private String user;
    private String product;
}
