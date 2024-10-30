package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.*;
import com.mactiem.clothingstore.website.entity.*;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {FeedBackMapper.class, SizeMapper.class})
@Component
public interface ProductMapper {

    //* DTO
    @Mapping(target = "categories", expression = "java(mapCategoryEntitiesToStrings(product.getCategories()))")
    @Mapping(target = "star", expression = "java(mapStar(product.getFeedBacks()))")
    @Mapping(target = "stock", expression = "java(mapStock(product.getSizeProducts()))")
    ProductResponseDTO toDTO(Product product);
    default int mapStock(List<SizeProduct> sizeProducts) {
        if (sizeProducts != null && !sizeProducts.isEmpty()) {
            return sizeProducts.stream()
                    .mapToInt(SizeProduct::getStock)
                    .sum();
        } else {
            return 0;
        }
    }

    @AfterMapping
    default ProductResponseDTO mapSizeProduct(@MappingTarget ProductResponseDTO productResponseDTO,
                                              Product product,
                                              SizeMapper sizeMapper) {
        for (SizeProduct sizeProduct : product.getSizeProducts()) {
            SizeProductDTO dto = new SizeProductDTO();
            dto.setStock(sizeProduct.getStock());
            dto.setUpdateDate(sizeProduct.getUpdateDate());
            dto.setSize(sizeMapper.toDTO(sizeProduct.getSize()));

            productResponseDTO.getSizeProducts().add(dto);
        }

        return productResponseDTO;
    }

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
                .toList();
    }


    default List<ProductResponseDTO> toListDTOs(List<Product> products) {
        return products.stream()
                .map(this::toDTO)
                .toList();
    }

    //* Entity
    @Mapping(target = "categories", ignore = true)
//    @Mapping(target = "enName", ignore = true)
//    @Mapping(target = "enDescription", ignore = true)
    Product toEntity(ProductRequestDTO productRequestDTO);
}
