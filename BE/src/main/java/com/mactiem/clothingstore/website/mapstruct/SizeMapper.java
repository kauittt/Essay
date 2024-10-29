package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.SizeDTO;
import com.mactiem.clothingstore.website.entity.Size;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {})
@Component
public interface SizeMapper {
    SizeDTO toDTO(Size size);
}
