package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.*;
import com.mactiem.clothingstore.website.entity.Banner;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.SizeProduct;
import com.mactiem.clothingstore.website.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
@Component
public interface BannerMapper {
    //* DTO
    BannerResponseDTO toDTO(Banner banner);

    @AfterMapping
    default BannerResponseDTO mapUser(@MappingTarget BannerResponseDTO bannerResponseDTO,
                                      Banner banner,
                                      UserMapper userMapper) {
        bannerResponseDTO.setUser(userMapper.toDTO(banner.getUser()));

        return bannerResponseDTO;
    }

    default List<BannerResponseDTO> toListDTOs(List<Banner> banners) {
        return banners.stream().map(this::toDTO).toList();
    }


    //* Entity
    Banner toEntity(BannerRequestDTO bannerRequestDTO);
}
