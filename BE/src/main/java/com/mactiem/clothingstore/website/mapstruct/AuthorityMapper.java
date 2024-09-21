package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring") //- Đc quản lý bớ Spring
@Component
public interface AuthorityMapper {
    //- DTO
    AuthorityDTO toDTO(Authority authority);

    default List<AuthorityDTO> toListDTOs(List<Authority> authorities) {
        return authorities.stream().map(this::toDTO).toList();
    }

    //- Entity
//    Authority toEntity(AuthorityDTO authorityDTO);
}
