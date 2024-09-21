package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.FeedBack;
import lombok.*;

import java.util.List;


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
    private List<FeedBackResponseDTO> feedBacks;


}
