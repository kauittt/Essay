package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {FeedBackMapper.class})
@Component
public interface ProductMapper {
    //- DTO
    ProductResponseDTO toDTO(Product product);


    @AfterMapping
    default void mapFeedBack(@MappingTarget ProductResponseDTO productResponseDTO, Product product
            , FeedBackMapper feedBackMapper) {
        productResponseDTO.setFeedBacks(feedBackMapper.toListDTOs(product.getFeedBacks()));
    }


    default List<ProductResponseDTO> toListDTOs(List<Product> products) {
        return products.stream().map(this::toDTO).toList();
    }

    //- Enttity
    Product toEntity(ProductRequestDTO productRequestDTO);

    @AfterMapping
    default void mapOthers(@MappingTarget Product product, ProductRequestDTO productRequestDTO) {
        product.setId(GenerateID.generateID());
    }
}
