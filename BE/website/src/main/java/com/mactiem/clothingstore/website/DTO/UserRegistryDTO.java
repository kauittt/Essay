package com.mactiem.clothingstore.website.DTO;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistryDTO {
    private String username;
    private String password;
    private String email;
    private String name;
    private String phone;
    private String address;
}
