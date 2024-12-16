package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.FeedBackResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.FeedBack;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserService.class, UserMapper.class})
@Component
public interface FeedBackMapper {
    //* DTO
//    @Mapping(target = "user", ignore = true)
    @Mapping(target = "username", expression = "java(mapUserUsername(feedBack))")
    @Mapping(target = "avatar", expression = "java(mapUserAvatar(feedBack))")
    @Mapping(target = "name", expression = "java(mapUserName(feedBack))")
    @Mapping(target = "size", source = "size")
    FeedBackResponseDTO toDTO(FeedBack feedBack);

    default String mapUserUsername(FeedBack feedback) {
        return feedback.getUser().getUsername();
    }

    default String mapUserAvatar(FeedBack feedback) {
        return feedback.getUser().getImage();
    }

    default String mapUserName(FeedBack feedback) {
        return feedback.getUser().getName();
    }


    default List<FeedBackResponseDTO> toListDTOs(List<FeedBack> feedBacks) {
        return feedBacks.stream().map(this::toDTO).toList();
    }

    //* Entity
    @Mapping(target = "user", source = "user", qualifiedByName = "byId")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "product", source = "product", ignore = true)
    FeedBack toEntity(FeedBackRequestDTO feedBackRequestDTO);

    @AfterMapping
    default void mapUser(@MappingTarget FeedBack feedBack, FeedBackRequestDTO feedBackRequestDTO,
                         UserService userService) {
        feedBack.setUser(userService.findUserById(feedBackRequestDTO.getUser()));
    }

    @AfterMapping
    default void mapBasicFields(@MappingTarget FeedBack feedBack, FeedBackRequestDTO feedBackRequestDTO) {

    }
}
