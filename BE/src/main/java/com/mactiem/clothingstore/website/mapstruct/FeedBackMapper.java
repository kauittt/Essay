package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.FeedBackResponseDTO;
import com.mactiem.clothingstore.website.entity.FeedBack;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserService.class})
@Component
public interface FeedBackMapper {
    //* DTO
//    @Mapping(target = "user", ignore = true)
    @Mapping(target = "user", expression = "java(mapUser(feedBack))")
    FeedBackResponseDTO toDTO(FeedBack feedBack);

    default Long mapUser(FeedBack feedback) {
        return feedback.getUser().getId();
    }

    default List<FeedBackResponseDTO> toListDTOs(List<FeedBack> feedBacks) {
        return feedBacks.stream().map(this::toDTO).toList();
    }

    //* Entity
    @Mapping(target = "user", source = "user", qualifiedByName = "byId")
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
