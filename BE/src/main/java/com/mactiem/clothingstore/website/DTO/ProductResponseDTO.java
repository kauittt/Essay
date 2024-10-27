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
    private List<String> categories;
    private String name;
    private String description;
    private String enName;
    private String enDescription;
    private Integer stock;
    private Double price;
    private String image;
    private List<FeedBackResponseDTO> feedBacks;
    private Double star;

    public List<FeedBackResponseDTO> getFeedBacks() {
        if (feedBacks == null) {
            feedBacks = new ArrayList<>();
        }
        return feedBacks;
    }

    public List<String> getCategories() {
        if (categories == null) {
            categories = new ArrayList<>();
        }
        return categories;
    }
}
