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

    // Validate the basic details of the invoice
    public void validateInvoiceRequest(InvoiceRequestDTO invoiceRequestDTO) {
        validateOrder(invoiceRequestDTO.getOrder());
        validatePaymentMethod(invoiceRequestDTO.getPaymentMethod());
        validateAmount(invoiceRequestDTO.getTotalAmount(), "Total Amount");
        validateAmount(invoiceRequestDTO.getDiscountAmount(), "Discount Amount");
    }

    // Validate order exists
    private void validateOrder(String order) {
        if (order == null || order.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be empty");
        }
        orderService.findOrderById(order);
    }

    // Validate payment method
    private void validatePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment Method cannot be empty");
        }
    }

    // Validate numeric amounts
    private void validateAmount(Double amount, String fieldName) {
        if (amount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot be null");
        }
        if (amount < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot be negative");
        }
    }
}
