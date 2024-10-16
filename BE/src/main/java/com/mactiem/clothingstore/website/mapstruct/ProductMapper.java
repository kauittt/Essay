package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.service.CategoryService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {FeedBackMapper.class, CategoryService.class, CategoryMapper.class})
@Component
public interface ProductMapper {
    //* DTO
    ProductResponseDTO toDTO(Product product);


    @AfterMapping
    default void mapFeedBack(@MappingTarget ProductResponseDTO productResponseDTO, Product product
            , FeedBackMapper feedBackMapper) {
        productResponseDTO.setFeedBacks(feedBackMapper.toListDTOs(product.getFeedBacks()));
    }

    @AfterMapping
    default void mapCategories(@MappingTarget ProductResponseDTO productResponseDTO, Product product
            , CategoryMapper categoryMapper) {
        productResponseDTO.setCategories(categoryMapper.toListDTOs(product.getCategories()));
    }


    default List<ProductResponseDTO> toListDTOs(List<Product> products) {
        return products.stream().map(this::toDTO).toList();
    }

    //* Enttity
    Product toEntity(ProductRequestDTO productRequestDTO);

    @AfterMapping
    default void mapCategories(@MappingTarget Product product, ProductRequestDTO productRequestDTO
            , CategoryService categoryService) {
        List<Category> categories = categoryService.findAllByIds(productRequestDTO.getCategories());
        product.setCategories(categories);
    }
}
