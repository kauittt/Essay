package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.FeedBackResponseDTO;
import com.mactiem.clothingstore.website.entity.FeedBack;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserService.class, ProductService.class})
@Component
public interface FeedBackMapper {
    //- DTO
    @Mapping(target = "user", ignore = true)
    FeedBackResponseDTO toDTO(FeedBack feedBack);

    @AfterMapping
    default void mapUser(@MappingTarget FeedBackResponseDTO feedBackResponseDTO, FeedBack feedBack) {
        feedBackResponseDTO.setUser(feedBack.getUser().getUsername());
    }

    default List<FeedBackResponseDTO> toListDTOs(List<FeedBack> feedBacks) {
        return feedBacks.stream().map(this::toDTO).toList();
    }

    //- Entity
    @Mapping(target = "user", source = "user", qualifiedByName = "byId")
    FeedBack toEntity(FeedBackRequestDTO feedBackRequestDTO);

    @AfterMapping
    default void mapUserAndProduct(@MappingTarget FeedBack feedBack, FeedBackRequestDTO feedBackRequestDTO,
                                   UserService userService, ProductService productService) {
        feedBack.setUser(userService.findUserById(feedBackRequestDTO.getUser()));
        feedBack.setProduct(productService.findProductById(feedBackRequestDTO.getProduct()));
    }

    @AfterMapping
    default void mapBasicFields(@MappingTarget FeedBack feedBack, FeedBackRequestDTO feedBackRequestDTO) {
        feedBack.setId(GenerateID.generateID());
        feedBack.setCreateDate(LocalDate.now());
        feedBack.setUpdateDate(LocalDate.now());
    }
}
