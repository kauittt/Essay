package com.mactiem.clothingstore.website.DTO;

import com.mactiem.clothingstore.website.entity.Order;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceResponseDTO {
    private Long id;
//    private Order order;
    private LocalDateTime createDate;
//    private String status;
    private Double totalAmount;
    private Double discountAmount;
    private String paymentMethod;
}
