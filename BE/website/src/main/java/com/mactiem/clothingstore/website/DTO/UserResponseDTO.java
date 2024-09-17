package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer id;

    private String username;

    private String email;

    private String name;

    private String phone;

    private String address;

    private LocalDate createDate;

    private LocalDate updateDate;

    private List<AuthorityDTO> authorities;

//    private CartResponseDTO cart;
//
//    private List<OrderResponseDTO> orders;
}
