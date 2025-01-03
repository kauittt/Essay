package com.mactiem.clothingstore.website.DTO;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistryDTO {
    private List<String> authorities;
    private String username;
    private String password;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String province;
    private String district;
    private String ward;
    private String image;
}

