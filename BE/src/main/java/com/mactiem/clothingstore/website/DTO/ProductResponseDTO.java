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
    private Long id;
    private List<CategoryResponseDTO> categories;
    private String name;
    private String description;
    private Integer stock;
    private Double price;
    private String image;
    private List<FeedBackResponseDTO> feedBacks;

    public List<FeedBackResponseDTO> getFeedBacks() {
        if (feedBacks == null) {
            feedBacks = new ArrayList<>();
        }
        return feedBacks;
    }

    public List<CategoryResponseDTO> getCategories() {
        if (categories == null) {
            categories = new ArrayList<>();
        }
        return categories;
    }
}
