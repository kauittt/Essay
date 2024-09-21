package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.InvoiceRequestDTO;
import com.mactiem.clothingstore.website.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class InvoiceValidator {
    private final OrderService orderService;

    @Autowired
    public InvoiceValidator(OrderService orderService) {
        this.orderService = orderService;
    }

    // Validate the details of the invoice
    public void validateInvoiceRequest(InvoiceRequestDTO invoiceRequestDTO) {
        validateOrder(invoiceRequestDTO.getOrder());
        validateNotEmpty(invoiceRequestDTO.getPaymentMethod(), "Payment Method");
        validateAmounts(invoiceRequestDTO.getTotalAmount(), "Total Amount");
        validateAmounts(invoiceRequestDTO.getDiscountAmount(), "Discount Amount");
    }

    // Validate non-empty fields
    private void validateNotEmpty(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot be empty");
        }
    }

    // Validate order exists
    private void validateOrder(String order) {
        validateNotEmpty(order, "Order");
        orderService.findOrderById(order);
    }

    // Validate numeric amounts
    private void validateAmounts(Double amount, String fieldName) {
        if (amount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot be null");
        }
        if (amount < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot be negative");
        }
    }
}
