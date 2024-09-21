package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Order;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceRequestDTO {
//    private String id;
//    private LocalDate createDate;
    private String order;
//    private String status;
    private String paymentMethod;
    private Double totalAmount;
    private Double discountAmount;
}
