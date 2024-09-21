package com.mactiem.clothingstore.website.mapstruct;


import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.service.AuthorityService;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = {AuthorityMapper.class, AuthorityService.class})
@Component
public interface UserMapper {
    //- DTO
    @Mapping(source = "authorities", target = "authorities")
    UserResponseDTO toDTO(User user);

    default List<UserResponseDTO> toListDTOs(List<User> users) {
        return users.stream().map(this::toDTO).toList();
    }

    @AfterMapping
    default void mapAuthoritiesForDTO(@MappingTarget UserResponseDTO userResponseDTO, User user
            , AuthorityMapper authorityMapper) {
        List<AuthorityDTO> authorityDTOS = authorityMapper.toListDTOs(user.getAuthorities());
        userResponseDTO.setAuthorities(authorityDTOS);
    }


    //- Entity
    @Mapping(source = "authorities", target = "authorities")
    User toEntity(UserRegistryDTO userRegistryDTO, @Context String type);

    @AfterMapping
    default void mapAuthoritiesForEntity(@MappingTarget User user, UserRegistryDTO userRegistryDTO,
                                         AuthorityService authorityService) {
        if (userRegistryDTO.getAuthorities() != null) {
            List<Authority> authorities = authorityService.getAuthoritiesByNames(userRegistryDTO.getAuthorities());
            user.setAuthorities(authorities);
        }
    }

    @AfterMapping
    default void mapOthers(@MappingTarget User user, @Context String type) {
        switch (type) {
            case "create":
                user.setId(GenerateID.generateID());
                user.setCreateDate(LocalDate.now());
                user.setUpdateDate(LocalDate.now());
                user.setEnabled(1);
                break;
            case "update":
                user.setUpdateDate(LocalDate.now());
                break;
            default:
        }
    }
}