package com.mactiem.clothingstore.website.DTO;


import com.mactiem.clothingstore.website.entity.Invoice;
import com.mactiem.clothingstore.website.entity.OrderProduct;
import com.mactiem.clothingstore.website.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    private String user;
    private List<String> products;
    private List<String> quantities;

    private String name; //- Update
    private String phone; //- Update
    private String address;
    private String status; //- Update

//    private String id;
//    private LocalDate createDate;
//    private LocalDate updateDate;


//-    private User user;
//-    private List<OrderProduct> orderProducts;

//    private Invoice invoice;


}
