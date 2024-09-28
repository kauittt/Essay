package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Order;
import lombok.*;

import java.time.LocalDate;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceResponseDTO {
    private String id;
//    private Order order;
    private LocalDate createDate;
//    private String status;
    private Double totalAmount;
    private Double discountAmount;
    private String paymentMethod;
}
