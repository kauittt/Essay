package com.mactiem.clothingstore.website.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private long amount;        // Số tiền cần thanh toán
    private String returnUrl;   // URL chuyển hướng sau thanh toán
}
