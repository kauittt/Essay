//package com.mactiem.clothingstore.website.mapstruct;
//
//import com.example.BookStore.DTO.UserRegistryDTO;
//import com.example.BookStore.DTO.UserResponseDTO;
//import com.example.BookStore.model.User;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//@Mapper
//public interface UserMapper {
//    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
//    CartMapper cartMapper = CartMapper.INSTANCE;
//    OrderMapper orderMapper = OrderMapper.INSTANCE;
//    AuthorityMapper authorityMapper = AuthorityMapper.INSTANCE;
//
//    //    @Mapping(source = "cart", target = "cart", ignore = true)
////    @Mapping(source = "orders", target = "orders", ignore = true)
//    UserResponseDTO toUserResponseDTO(User user);
//
//    @Mapping(source = "email", target = "email")
//    User toEnity(UserRegistryDTO userRegistryDTO);
//
//    default UserResponseDTO toUserResponseDTOFull(User user) {
//        UserResponseDTO userResponseDTO = toUserResponseDTO(user);
//
////        if (user.getOrders() == null) user.setOrders(new ArrayList<>());
////        if (user.getCart() == null) user.setCart(new Cart());
//
//        userResponseDTO.setCart(cartMapper.toDTOWithBooks(user.getCart()));
//        userResponseDTO.setOrders(orderMapper.toListDTOWithBooks(user.getOrders()));
//        userResponseDTO.setAuthorities(user.getAuthorities().stream().map(authorityMapper::todTO).toList());
//
//        return userResponseDTO;
//    }
//}
