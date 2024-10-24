package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.DTO.VoucherResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Voucher;
import com.mactiem.clothingstore.website.service.ProductService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class, ProductService.class})
@Component
public interface VoucherMapper {
    //* DTO
    VoucherResponseDTO toDTO(Voucher voucher);

    @AfterMapping
    default void mapProducts(@MappingTarget VoucherResponseDTO voucherResponseDTO
            , Voucher voucher, ProductMapper productMapper, ProductService productService) {
        voucherResponseDTO.setProducts(productMapper.toListDTOs(voucher.getProducts()));
    }

    default List<VoucherResponseDTO> toListDTOs(List<Voucher> vouchers) {
        return vouchers.stream().map(this::toDTO).toList();
    }

    //* Entity
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "discountPercentage", ignore = true)
    @Mapping(target = "enName", ignore = true)
    Voucher toEntity(VoucherRequestDTO voucherRequestDTO);

//    @AfterMapping
//    default void mapProducts(@MappingTarget Voucher voucher, VoucherRequestDTO voucherRequestDTO, ProductService productService) {
//        if (!voucherRequestDTO.getProducts().isEmpty()) {
//            voucher.setProducts(productService.findProductsByIds(voucherRequestDTO.getProducts()));
//        } else {
//            voucher.setProducts(productService.findAllProducts());
//        }
//    }
}
