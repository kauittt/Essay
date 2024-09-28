package com.mactiem.clothingstore.website.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.DTO.VoucherResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.Voucher;
import com.mactiem.clothingstore.website.mapstruct.VoucherMapper;
import com.mactiem.clothingstore.website.repository.VoucherRepository;
import com.mactiem.clothingstore.website.validator.VoucherValidator;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class VoucherServiceTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private VoucherService voucherService;

    @MockBean
    private VoucherRepository voucherRepository;
    @MockBean
    private VoucherMapper voucherMapper;
    @MockBean
    private VoucherValidator voucherValidator;
    @MockBean
    private EntityManager entityManager;

    private VoucherRequestDTO request;
    private VoucherResponseDTO response;
    private List<VoucherResponseDTO> responseList;
    private Voucher voucher;
    private List<Voucher> voucherList;
    private final String VOUCHER_ID =  GenerateID.generateID();
    @BeforeEach
    public void setup() {
        entityManager.clear();

        request = new VoucherRequestDTO();
        request.setName("DISCOUNT10");
        request.setDiscountPercentage(10.0);
        request.setQuantity(10);

        response = new VoucherResponseDTO();
        response.setId(VOUCHER_ID);
        response.setName("DISCOUNT10");
        response.setDiscountPercentage(0.1);
        response.setQuantity(10);

        voucher = new Voucher();
        voucher.setId(VOUCHER_ID);
        voucher.setName("DISCOUNT10");
        voucher.setDiscountPercentage(0.1);
        voucher.setQuantity(10);

        voucherList = new ArrayList<>();
        voucherList.add(voucher);

        responseList = new ArrayList<>();
        responseList.add(response);
    }


    // --- Get All Vouchers ---
    @Test
    public void testGetAllVouchers_whenVouchersExist_returnVoucherList() {
        Mockito.when(voucherRepository.findAll()).thenReturn(voucherList);
        Mockito.when(voucherMapper.toListDTOs(voucherList)).thenReturn(responseList);

        List<VoucherResponseDTO> result = voucherService.getAllVouchers();

        assertNotNull(result, "Result should not be null");
        assertFalse(result.isEmpty(), "Result list should not be empty");
        assertEquals(1, result.size(), "Expected one voucher in the result");
        assertEquals("DISCOUNT10", result.get(0).getName(), "Voucher name should match");

        Mockito.verify(voucherRepository, Mockito.times(1)).findAll();
        Mockito.verify(voucherMapper, Mockito.times(1)).toListDTOs(voucherList);
    }


    // --- Get Voucher By ID ---
    @Test
    public void testGetVoucherById_whenVoucherExists_returnVoucherResponseDTO() {
        Mockito.when(voucherRepository.findById(eq(VOUCHER_ID))).thenReturn(Optional.of(voucher));
        Mockito.when(voucherMapper.toDTO(any(Voucher.class))).thenReturn(response);

        VoucherResponseDTO result = voucherService.getVoucherById(VOUCHER_ID);

        assertNotNull(result);
        assertEquals("DISCOUNT10", result.getName());

        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(VOUCHER_ID));
        Mockito.verify(voucherMapper, Mockito.times(1)).toDTO(any(Voucher.class));
    }

    // --- Create Voucher ---
    @Test
    public void testCreateVoucher_whenValidData_thenVoucherIsCreated() {

        Mockito.doNothing().when(voucherValidator).validateVoucherRequest(eq(request));
        Mockito.when(voucherMapper.toEntity(eq(request))).thenReturn(voucher);
        Mockito.when(voucherRepository.save(any(Voucher.class))).thenReturn(voucher);
        Mockito.when(voucherMapper.toDTO(any(Voucher.class))).thenReturn(response);

        VoucherResponseDTO result = voucherService.createVoucher(request);

        assertNotNull(result);
        assertEquals("DISCOUNT10", result.getName());

        Mockito.verify(voucherValidator, Mockito.times(1)).validateVoucherRequest(eq(request));
        Mockito.verify(voucherMapper, Mockito.times(1)).toEntity(eq(request));
        Mockito.verify(voucherRepository, Mockito.times(1)).save(any(Voucher.class));
        Mockito.verify(voucherMapper, Mockito.times(1)).toDTO(any(Voucher.class));
    }

    // --- Update Voucher ---
    @Test
    public void testUpdateVoucher_whenValidData_thenVoucherIsUpdated() {
        // Arrange
        Mockito.when(voucherRepository.findById(eq(VOUCHER_ID))).thenReturn(Optional.of(voucher));
        Mockito.when(voucherRepository.save(any(Voucher.class))).thenReturn(voucher);
        Mockito.when(voucherMapper.toDTO(any(Voucher.class))).thenReturn(response);


        // Act
        VoucherResponseDTO result = voucherService.updateVoucher(VOUCHER_ID, request);

        // Assert
        assertNotNull(result);
        assertEquals("DISCOUNT10", result.getName());

        // Verify the interactions
        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(VOUCHER_ID));
        Mockito.verify(voucherRepository, Mockito.times(1)).save(any(Voucher.class));
        Mockito.verify(voucherMapper, Mockito.times(1)).toDTO(any(Voucher.class));
    }


    // --- Delete Voucher ---
    @Test
    public void testDeleteVoucher_whenVoucherExists_thenVoucherIsDeleted() {
        Mockito.when(voucherRepository.findById(eq(VOUCHER_ID))).thenReturn(Optional.of(voucher));

        voucherService.deleteVoucher(VOUCHER_ID);

        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(VOUCHER_ID));
        Mockito.verify(voucherRepository, Mockito.times(1)).delete(eq(voucher));
    }


    // --- Get Voucher By ID Failure ---
    @Test
    public void testGetVoucherById_whenVoucherDoesNotExist_thenThrowException() {
        String id = "nonexistent";
        Mockito.when(voucherRepository.findById(eq(id))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            voucherService.getVoucherById(id);
        });

        assertEquals(Response.notFound("Voucher", id), exception.getMessage());
        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(id));
    }

    // --- Create Voucher Failure ---
    @Test
    public void testCreateVoucher_whenInvalidData_thenThrowException() {
        VoucherRequestDTO invalidRequest = new VoucherRequestDTO();
        invalidRequest.setName("");  // Assuming empty name is invalid
        invalidRequest.setDiscountPercentage(150.0);  // Assuming discount over 100% is invalid

        Mockito.doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid voucher data"))
                .when(voucherValidator).validateVoucherRequest(any(VoucherRequestDTO.class));

        Exception exception = assertThrows(ResponseStatusException.class, () -> {
            voucherService.createVoucher(invalidRequest);
        });

        assertEquals("400 BAD_REQUEST \"Invalid voucher data\"", exception.getMessage());
        Mockito.verify(voucherValidator, Mockito.times(1)).validateVoucherRequest(any(VoucherRequestDTO.class));
        Mockito.verify(voucherMapper, Mockito.never()).toEntity(any(VoucherRequestDTO.class));
        Mockito.verify(voucherRepository, Mockito.never()).save(any(Voucher.class));
    }

    // --- Update Voucher Failure ---
    @Test
    public void testUpdateVoucher_whenVoucherDoesNotExist_thenThrowException() {
        String id = "nonexistent";
        Mockito.when(voucherRepository.findById(eq(id))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            voucherService.updateVoucher(id, request);
        });

        assertEquals(Response.notFound("Voucher", id), exception.getMessage());
        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(id));
        Mockito.verify(voucherMapper, Mockito.never()).toEntity(any(VoucherRequestDTO.class));
        Mockito.verify(voucherRepository, Mockito.never()).save(any(Voucher.class));
    }

    // --- Delete Voucher Failure ---
    @Test
    public void testDeleteVoucher_whenVoucherDoesNotExist_thenThrowException() {
        String id = "nonexistent";
        Mockito.when(voucherRepository.findById(eq(id))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            voucherService.deleteVoucher(id);
        });

        assertEquals(Response.notFound("Voucher", id), exception.getMessage());
        Mockito.verify(voucherRepository, Mockito.times(1)).findById(eq(id));
        Mockito.verify(voucherRepository, Mockito.never()).delete(any(Voucher.class));
    }
}
