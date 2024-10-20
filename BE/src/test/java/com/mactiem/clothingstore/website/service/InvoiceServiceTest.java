//package com.mactiem.clothingstore.website.service;
//
//import com.mactiem.clothingstore.website.DTO.InvoiceRequestDTO;
//import com.mactiem.clothingstore.website.DTO.InvoiceResponseDTO;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Invoice;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.mapstruct.InvoiceMapper;
//import com.mactiem.clothingstore.website.repository.InvoiceRepository;
//import com.mactiem.clothingstore.website.validator.InvoiceValidator;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.ArgumentCaptor;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.time.LocalDate;
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//
//@SpringBootTest
//public class InvoiceServiceTest {
//
//    @Autowired
//    private InvoiceService invoiceService;
//
//    @MockBean
//    private InvoiceRepository invoiceRepository;
//
//    @MockBean
//    private InvoiceMapper invoiceMapper;
//
//    @MockBean
//    private InvoiceValidator invoiceValidator;
//
//    private InvoiceRequestDTO validRequest;
//    private InvoiceResponseDTO validResponse;
//    private Invoice invoice;
//    private List<Invoice> invoiceList;
//    private List<InvoiceResponseDTO> responseList;
//    private final String INVOICE_ID = GenerateID.generateID();
//
//    @BeforeEach
//    public void setup() {
//        // Initialize InvoiceRequestDTO (Valid Request)
//        validRequest = InvoiceRequestDTO.builder()
//                .order("order-id-123")
//                .paymentMethod("Credit Card")
//                .totalAmount(150.00)
//                .discountAmount(10.00)
//                .build();
//
//        // Initialize Invoice entity
//        invoice = Invoice.builder()
//                .id(INVOICE_ID)
//                .order(null) // Assuming no order linkage initially
//                .createDate(LocalDate.now())
//                .totalAmount(150.00)
//                .discountAmount(10.00)
//                .paymentMethod("Credit Card")
//                .build();
//
//        // Initialize InvoiceResponseDTO
//        validResponse = InvoiceResponseDTO.builder()
//                .id(INVOICE_ID)
//                .createDate(LocalDate.now())
//                .totalAmount(150.00)
//                .discountAmount(10.00)
//                .paymentMethod("Credit Card")
//                .build();
//
//        // Initialize list of Invoices
//        invoiceList = Collections.singletonList(invoice);
//
//        // Initialize list of InvoiceResponseDTO
//        responseList = Collections.singletonList(validResponse);
//    }
//
//    // --- Get All Invoices ---
//    @Test
//    public void testGetAllInvoices_whenInvoicesExist_returnListOfInvoiceResponseDTOs() {
//        // GIVEN
//        when(invoiceRepository.findAll()).thenReturn(invoiceList);
//        when(invoiceMapper.toListDTOs(invoiceList)).thenReturn(responseList);
//
//        // WHEN
//        List<InvoiceResponseDTO> result = invoiceService.getAllInvoices();
//
//        // THEN
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals("Credit Card", result.get(0).getPaymentMethod());
//
//        verify(invoiceRepository, times(1)).findAll();
//        verify(invoiceMapper, times(1)).toListDTOs(invoiceList);
//    }
//
//    @Test
//    public void testGetAllInvoices_whenNoInvoicesExist_returnEmptyList() {
//        // GIVEN
//        when(invoiceRepository.findAll()).thenReturn(Collections.emptyList());
//        when(invoiceMapper.toListDTOs(Collections.emptyList())).thenReturn(Collections.emptyList());
//
//        // WHEN
//        List<InvoiceResponseDTO> result = invoiceService.getAllInvoices();
//
//        // THEN
//        assertNotNull(result);
//        assertTrue(result.isEmpty());
//
//        verify(invoiceRepository, times(1)).findAll();
//        verify(invoiceMapper, times(1)).toListDTOs(Collections.emptyList());
//    }
//
//    // --- Get Invoice By ID ---
//    @Test
//    public void testGetInvoiceById_whenInvoiceExists_returnInvoiceResponseDTO() {
//        // GIVEN
//        when(invoiceRepository.findById(INVOICE_ID)).thenReturn(Optional.of(invoice));
//        when(invoiceMapper.toDTO(invoice)).thenReturn(validResponse);
//
//        // WHEN
//        InvoiceResponseDTO result = invoiceService.getInvoiceById(INVOICE_ID);
//
//        // THEN
//        assertNotNull(result);
//        assertEquals("Credit Card", result.getPaymentMethod());
//        assertEquals(150.00, result.getTotalAmount());
//
//        verify(invoiceRepository, times(1)).findById(INVOICE_ID);
//        verify(invoiceMapper, times(1)).toDTO(invoice);
//    }
//
//    @Test
//    public void testGetInvoiceById_whenInvoiceDoesNotExist_throwException() {
//        // GIVEN
//        String nonExistentId = "non-existent-id";
//        when(invoiceRepository.findById(nonExistentId)).thenReturn(Optional.empty());
//
//        // WHEN & THEN
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.getInvoiceById(nonExistentId));
//        assertEquals(Response.notFound("Invoice", nonExistentId), exception.getMessage());
//
//        verify(invoiceRepository, times(1)).findById(nonExistentId);
//        verify(invoiceMapper, times(0)).toDTO(any());
//    }
//
//    // --- Create Invoice ---
//    @Test
//    public void testCreateInvoice_whenValidRequest_thenInvoiceIsCreated() {
//        // GIVEN
//        Mockito.doNothing().when(invoiceValidator).validateInvoiceRequest(eq(validRequest));
//        when(invoiceMapper.toEntity(validRequest)).thenReturn(invoice);
//        when(invoiceRepository.save(invoice)).thenReturn(invoice);
//        when(invoiceMapper.toDTO(invoice)).thenReturn(validResponse);
//
//        // WHEN
//        InvoiceResponseDTO result = invoiceService.create(validRequest);
//
//        // THEN
//        assertNotNull(result);
//        assertEquals("Credit Card", result.getPaymentMethod());
//        assertEquals(150.00, result.getTotalAmount());
//
//        verify(invoiceValidator, times(1)).validateInvoiceRequest(validRequest);
//        verify(invoiceMapper, times(1)).toEntity(validRequest);
//        verify(invoiceRepository, times(1)).save(invoice);
//        verify(invoiceMapper, times(1)).toDTO(invoice);
//    }
//
//    @Test
//    public void testCreateInvoice_whenInvalidRequest_throwException() {
//        // GIVEN
//        String errorMessage = "Invalid invoice data";
//        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
//                .when(invoiceValidator).validateInvoiceRequest(any(InvoiceRequestDTO.class));
//
//        // WHEN & THEN
//        ResponseStatusException exception = assertThrows(
//                ResponseStatusException.class,
//                () -> invoiceService.create(validRequest)
//        );
//        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
//        assertEquals(errorMessage, exception.getReason());
//
//        verify(invoiceValidator, times(1)).validateInvoiceRequest(validRequest);
//        verify(invoiceMapper, times(0)).toEntity(any());
//        verify(invoiceRepository, times(0)).save(any());
//        verify(invoiceMapper, times(0)).toDTO(any());
//    }
//
//
//}
