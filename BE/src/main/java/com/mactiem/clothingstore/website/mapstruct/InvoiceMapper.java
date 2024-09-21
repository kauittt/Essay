package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.InvoiceRequestDTO;
import com.mactiem.clothingstore.website.DTO.InvoiceResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Invoice;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.service.OrderService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderService.class})
@Component
public interface InvoiceMapper {
    //- DTO
    InvoiceResponseDTO toDTO(Invoice invoice);

    default List<InvoiceResponseDTO> toListDTOs(List<Invoice> invoices) {
        return invoices.stream().map(this::toDTO).toList();
    }


    //- Entity
    Invoice toEntity(InvoiceRequestDTO invoiceRequestDTO);

    @AfterMapping
    default void mapFields(@MappingTarget Invoice invoice, InvoiceRequestDTO invoiceRequestDTO
            , OrderService orderService) {
        invoice.setOrder(orderService.findOrderById(invoiceRequestDTO.getOrder()));
        invoice.setId(GenerateID.generateID());
    }
}
