package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.CartProductDTO;
import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Cart;
import com.mactiem.clothingstore.website.entity.CartProduct;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.service.CartService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {CartService.class, ProductMapper.class})
@Component
public interface CartMapper {
    //- DTO
    CartResponseDTO toDTO(Cart cart);
    @AfterMapping
    default CartResponseDTO mapCartProduct(@MappingTarget CartResponseDTO cartResponseDTO, Cart cart, ProductMapper productMapper) {
        for (CartProduct cartProduct : cart.getCartProducts()) {
            CartProductDTO dto = new CartProductDTO();
            dto.setQuantity(cartProduct.getQuantity());
            dto.setProduct(productMapper.toDTO(cartProduct.getProduct()));

            cartResponseDTO.getCartProducts().add(dto);
        }

        return cartResponseDTO;
    }


    //- New
    default UserResponseDTO toCartForUser(UserResponseDTO userResponseDTO, Cart cart, ProductMapper productMapper) {
        for (CartProduct cartProduct : cart.getCartProducts()) {
            CartProductDTO dto = new CartProductDTO();
            dto.setQuantity(cartProduct.getQuantity());
            dto.setProduct(productMapper.toDTO(cartProduct.getProduct()));

            userResponseDTO.getCart().add(dto);
        }

        return userResponseDTO;
    }
}
