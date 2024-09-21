package com.mactiem.clothingstore.website.DTO;

import lombok.*;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    private String id;
    private String name;
    private String description;
    private Double price;
    private String image;
    private String category;
    private Integer stock;

//    private List<Voucher> vouchers;
//    private List<FeedBack> feedBacks;


}
