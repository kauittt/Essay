package com.mactiem.clothingstore.website.DTO;


import com.mactiem.clothingstore.website.entity.Invoice;
import com.mactiem.clothingstore.website.entity.OrderProduct;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String address;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private List<OrderProductDTO> orderProducts;
    private InvoiceResponseDTO invoice;
    private VoucherResponseDTO voucher;

    public InvoiceResponseDTO getInvoice() {
        if (invoice == null) {
            invoice = new InvoiceResponseDTO();
        }
        return invoice;
    }

    public List<OrderProductDTO> getOrderProducts() {
        if (orderProducts == null) {
            orderProducts = new ArrayList<>();
        }
        return orderProducts;
    }
}
