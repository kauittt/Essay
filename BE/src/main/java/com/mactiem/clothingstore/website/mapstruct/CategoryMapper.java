package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.CategoryRequestDTO;
import com.mactiem.clothingstore.website.DTO.CategoryResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.CategoryService;
import com.mactiem.clothingstore.website.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper(componentModel = "spring", uses = {UserService.class, ProductMapper.class})
@Component
public interface CategoryMapper {

    //* DTO
//    @Mapping(source = "products", ignore = true)
    CategoryResponseDTO toDTO(Category category);

    @AfterMapping
    default void mapProducts(@MappingTarget CategoryResponseDTO  categoryResponseDTO, Category category
            , ProductMapper productMapper) {
        categoryResponseDTO.setProducts(productMapper.toListDTOs(category.getProducts()));
    }

    default List<CategoryResponseDTO> toListDTOs(List<Category> categories) {
        return categories.stream().map(this::toDTO).toList();
    }


    //* Entity
    @Mapping(target = "enName", ignore = true)
    Category toEntity(CategoryRequestDTO categoryRequestDTO);

}
