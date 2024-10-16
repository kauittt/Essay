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
@Builder
public class InvoiceRequestDTO {
//    private String id;
//    private LocalDate createDate;
    private String order;
    private Double totalAmount;
    private Double discountAmount;
    private String paymentMethod;
}
