package com.mactiem.clothingstore.website.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.InvoiceRequestDTO;
import com.mactiem.clothingstore.website.DTO.InvoiceResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Invoice;
import com.mactiem.clothingstore.website.service.InvoiceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InvoiceService invoiceService;

    private InvoiceRequestDTO validRequest;
    private InvoiceResponseDTO validResponse;
    private Invoice invoice;
    private List<Invoice> invoiceList;
    private List<InvoiceResponseDTO> responseList;
    private final long INVOICE_ID = 1L;

    @BeforeEach
    public void setup() {
        // Initialize InvoiceRequestDTO (Valid Request)
        validRequest = InvoiceRequestDTO.builder()
                .order("1")
                .paymentMethod("Credit Card")
                .totalAmount(150.00)
                .discountAmount(10.00)
                .build();

        // Initialize Invoice entity
        invoice = Invoice.builder()
                .id(INVOICE_ID)
                .order(null) // Assuming no order linkage initially
                .createDate(LocalDateTime.now())
                .totalAmount(150.00)
                .discountAmount(10.00)
                .paymentMethod("Credit Card")
                .build();

        // Initialize InvoiceResponseDTO
        validResponse = InvoiceResponseDTO.builder()
                .id(INVOICE_ID)
                .createDate(LocalDateTime.now())
                .totalAmount(150.00)
                .discountAmount(10.00)
                .paymentMethod("Credit Card")
                .build();

        // Initialize list of Invoices
        invoiceList = Collections.singletonList(invoice);

        // Initialize list of InvoiceResponseDTO
        responseList = Collections.singletonList(validResponse);
    }

    // --- GET ALL INVOICES ----------------------------------------------------------------------------------------

    @Test
    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
    public void testGetAllInvoices_whenSuccess_returnListOfInvoices() throws Exception {
        // Given
        Mockito.when(invoiceService.getAllInvoices()).thenReturn(responseList);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/invoices")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(responseList.size()))
                .andExpect(jsonPath("$[0].id").value(validResponse.getId()))
//                .andExpect(jsonPath("$[0].createDate").value(validResponse.getCreateDate().toString()))
                .andExpect(jsonPath("$[0].totalAmount").value(validResponse.getTotalAmount()))
                .andExpect(jsonPath("$[0].discountAmount").value(validResponse.getDiscountAmount()))
                .andExpect(jsonPath("$[0].paymentMethod").value(validResponse.getPaymentMethod()));
        // Add more assertions if needed for nested objects

        Mockito.verify(invoiceService, Mockito.times(1)).getAllInvoices();
    }

    @Test
    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
    public void testGetAllInvoices_whenNoInvoices_returnEmptyList() throws Exception {
        // Given
        Mockito.when(invoiceService.getAllInvoices()).thenReturn(List.of());

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/invoices")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        Mockito.verify(invoiceService, Mockito.times(1)).getAllInvoices();
    }

    // --- GET INVOICE BY ID ----------------------------------------------------------------------------------------

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetInvoiceById_whenValidId_returnInvoice() throws Exception {
        // Given
        Mockito.when(invoiceService.getInvoiceById(eq(INVOICE_ID+""))).thenReturn(validResponse);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/invoices/{id}", INVOICE_ID+"")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(validResponse.getId()))
//                .andExpect(jsonPath("$.createDate").value(validResponse.getCreateDate().toString()))
                .andExpect(jsonPath("$.totalAmount").value(validResponse.getTotalAmount()))
                .andExpect(jsonPath("$.discountAmount").value(validResponse.getDiscountAmount()))
                .andExpect(jsonPath("$.paymentMethod").value(validResponse.getPaymentMethod()));
        // Add more assertions if needed for nested objects

        Mockito.verify(invoiceService, Mockito.times(1)).getInvoiceById(eq(INVOICE_ID+""));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetInvoiceById_whenInvoiceNotFound_returnNotFound() throws Exception {
        // Given
        String nonExistentId = "non-existent-id";
        String errorMessage = "Invoice not found with id: " + nonExistentId;
        Mockito.when(invoiceService.getInvoiceById(eq(nonExistentId)))
                .thenThrow(new RuntimeException(errorMessage));

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/invoices/{id}", nonExistentId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value(errorMessage));

        Mockito.verify(invoiceService, Mockito.times(1)).getInvoiceById(eq(nonExistentId));
    }

    // --- CREATE INVOICE ----------------------------------------------------------------------------------------

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateInvoice_whenValidRequest_returnInvoiceResponse() throws Exception {
        // Given
        Mockito.when(invoiceService.create(eq(validRequest))).thenReturn(validResponse);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(validResponse.getId()))
//                .andExpect(jsonPath("$.createDate").value(validResponse.getCreateDate()))
                .andExpect(jsonPath("$.totalAmount").value(validResponse.getTotalAmount()))
                .andExpect(jsonPath("$.discountAmount").value(validResponse.getDiscountAmount()))
                .andExpect(jsonPath("$.paymentMethod").value(validResponse.getPaymentMethod()));
        // Add more assertions if needed for nested objects

        Mockito.verify(invoiceService, Mockito.times(1)).create(eq(validRequest));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateInvoice_whenInvalidRequest_returnBadRequest() throws Exception {
        // Given
        InvoiceRequestDTO badRequest = InvoiceRequestDTO.builder()
                .order("") // Invalid order ID
                .paymentMethod("Credit Card")
                .totalAmount(-50.00) // Invalid total amount
                .discountAmount(-10.00) // Invalid discount amount
                .build();
        String errorMessage = "Invalid invoice data";
        Mockito.when(invoiceService.create(eq(badRequest)))
                .thenThrow(new RuntimeException(errorMessage));

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
                .andExpect(jsonPath("$.message").value(errorMessage));

        Mockito.verify(invoiceService, Mockito.times(1)).create(eq(badRequest));
    }

}
