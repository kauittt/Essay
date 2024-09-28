package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.FeedBack;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponseDTO {
    private String id;
    private String name;
    private String description;
    private Double price;
    private String image;
    private String category;
    private Integer stock;
    private List<FeedBackResponseDTO> feedBacks;


    public List<FeedBackResponseDTO> getFeedBacks() {
        if (feedBacks == null) {
            feedBacks = new ArrayList<>();
        }
        return feedBacks;
    }
}
