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
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
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
    default void mapBasicFields(@MappingTarget Invoice invoice, InvoiceRequestDTO invoiceRequestDTO) {
        invoice.setId(GenerateID.generateID());
        invoice.setCreateDate(LocalDate.now());
    }

    @AfterMapping
    default void mapOrder(@MappingTarget Invoice invoice, InvoiceRequestDTO invoiceRequestDTO
            , OrderService orderService) {
        invoice.setOrder(orderService.findOrderById(invoiceRequestDTO.getOrder()));
    }
}
