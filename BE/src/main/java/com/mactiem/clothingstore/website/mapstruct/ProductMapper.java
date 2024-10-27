package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.CategoryResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {FeedBackMapper.class})
@Component
public interface ProductMapper {

    //* DTO
    @Mapping(target = "categories", expression = "java(mapCategoryEntitiesToStrings(product.getCategories()))")
    @Mapping(target = "star", expression = "java(mapStar(product.getFeedBacks()))")
    ProductResponseDTO toDTO(Product product);

    @AfterMapping
    default void mapFeedBack(@MappingTarget ProductResponseDTO productResponseDTO, Product product,
                             FeedBackMapper feedBackMapper) {
        productResponseDTO.setFeedBacks(feedBackMapper.toListDTOs(product.getFeedBacks()));
    }

    default Double mapStar(List<FeedBack> feedBacks) {
        if (feedBacks != null && !feedBacks.isEmpty()) {
            return feedBacks.stream()
                    .filter(f -> f.getPoint() != null)
                    .mapToDouble(FeedBack::getPoint)
                    .average()
                    .orElse(0.0);
        } else {
            return 0.0;
        }
    }

    default List<String> mapCategoryEntitiesToStrings(List<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return List.of(); // Return an empty list if categories are null or empty
        }
        return categories.stream()
                .filter(category -> category != null && category.getName() != null)
                .map(Category::getName)
                .collect(Collectors.toList());
    }

//    @AfterMapping
//    default void mapCategories(@MappingTarget ProductResponseDTO productResponseDTO, Product product) {
//        List<Category> categories = product.getCategories();
//        if (categories != null) {
//            categories.forEach(category -> {
//                if (category != null) {
//                    System.out.println("Category name: " + category.getName());
//                } else {
//                    System.out.println("Found null category");
//                }
//            });
//        } else {
//            System.out.println("No categories found for product");
//        }
//
//        productResponseDTO.setCategories(mapCategoryEntitiesToStrings(categories));
//    }
//
//    // Custom method to map List<Category> to List<String>
//    default List<String> mapCategoryEntitiesToStrings(List<Category> categories) {
//        if (categories == null) {
//            return List.of(); // Return an empty list if categories are null
//        }
//        return categories.stream()
//                .filter(category -> category != null && category.getName() != null) // Filter out null categories and null names
//                .map(Category::getName)
//                .toList();
//    }

    default List<ProductResponseDTO> toListDTOs(List<Product> products) {
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    //* Entity
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "enName", ignore = true)
    @Mapping(target = "enDescription", ignore = true)
    Product toEntity(ProductRequestDTO productRequestDTO);

//    // Mapping category names from ProductRequestDTO to Category entities
//    @AfterMapping
//    default void mapCategories(@MappingTarget Product product, ProductRequestDTO productRequestDTO,
//                               CategoryService categoryService) {
//        List<Category> categories = categoryService.findAllByNames(productRequestDTO.getCategories());
//        product.setCategories(categories);
//    }
}
