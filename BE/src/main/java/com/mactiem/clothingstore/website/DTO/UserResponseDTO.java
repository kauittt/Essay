package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;

    private String username;

    private String email;

    private String name;

    private String phone;

    private String address;

    private String image;

    private LocalDate createDate;

    private LocalDate updateDate;

    private List<AuthorityDTO> authorities;

    private List<CartProductDTO> cart;

    private List<OrderResponseDTO> orders;

    public List<CartProductDTO> getCart() {
        if (cart == null) {
            cart = new ArrayList<>();
        }
        return cart;
    }

    public List<AuthorityDTO> getAuthorities() {
        if (authorities == null) {
            authorities = new ArrayList<>();
        }
        return authorities;
    }

    public List<OrderResponseDTO> getOrders() {
        if (orders == null) {
            orders = new ArrayList<>();
        }
        return orders;
    }
}
