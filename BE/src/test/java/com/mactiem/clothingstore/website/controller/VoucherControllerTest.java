//package com.mactiem.clothingstore.website.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
//import com.mactiem.clothingstore.website.DTO.VoucherResponseDTO;
//import com.mactiem.clothingstore.website.entity.Voucher;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.service.VoucherService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class VoucherControllerTest {
//    @Autowired
//    private MockMvc mockMvc;
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private VoucherService voucherService;
//
//    private VoucherRequestDTO request;
//    private VoucherResponseDTO response;
//    private List<VoucherResponseDTO> responseList;
//    private Voucher voucher;
//    private List<Voucher> voucherList;
//    private final String VOUCHER_ID = "1";
//
//    @BeforeEach
//    public void setup() {
//        request = new VoucherRequestDTO();
//        request.setName("DISCOUNT10");
//        request.setDiscountPercentage(10.0);
//        request.setQuantity(10);
//
//        response = new VoucherResponseDTO();
//        response.setId("1");
//        response.setName("DISCOUNT10");
//        response.setDiscountPercentage(0.1);
//        response.setQuantity(10);
//
//        voucher = new Voucher();
//        voucher.setId("1");
//        voucher.setName("DISCOUNT10");
//        voucher.setDiscountPercentage(0.1);
//        voucher.setQuantity(10);
//
//        voucherList = new ArrayList<>();
//        voucherList.add(voucher);
//
//        responseList = new ArrayList<>();
//        responseList.add(response);
//    }
//
//    //! CREATE VOUCHER ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateVoucher_whenValidRequest_returnVoucherResponseDTO() throws Exception {
//        Mockito.when(voucherService.createVoucher(eq(request))).thenReturn(response);
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/vouchers")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"));
//        Mockito.verify(voucherService, Mockito.times(1)).createVoucher(eq(request));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateVoucher_whenInvalidRequest_returnBadRequest() throws Exception {
//        Mockito.when(voucherService.createVoucher(any(VoucherRequestDTO.class)))
//                .thenThrow(new RuntimeException("Invalid voucher data"));
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/vouchers")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//
//        Mockito.verify(voucherService, Mockito.times(1)).createVoucher(any(VoucherRequestDTO.class));
//
//    }
//
//    //! GET ALL VOUCHERS ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testGetAllVouchers_whenAdmin_returnListOfVouchers() throws Exception {
//        // Given
//        Mockito.when(voucherService.getAllVouchers()).thenReturn(responseList);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/vouchers")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value("1"))
//                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("DISCOUNT10"))
//                .andExpect(MockMvcResultMatchers.jsonPath("$[0].discountPercentage").value(0.1))
//                .andExpect(MockMvcResultMatchers.jsonPath("$[0].quantity").value(10));
//
//        Mockito.verify(voucherService, Mockito.times(1)).getAllVouchers();
//    }
//
//    @Test
//    @WithMockUser(username = "testuser", roles = {"USER"})
//    public void testGetAllVouchers_whenSuccess_returnEmptyVoucherList() throws Exception {
//        // Given
//        List<VoucherResponseDTO> emptyList = List.of();
//        Mockito.when(voucherService.getAllVouchers()).thenReturn(emptyList);
//
//        // When
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/vouchers")
//                        .contentType(MediaType.APPLICATION_JSON))
//                // Then
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
//
//        Mockito.verify(voucherService, Mockito.times(1)).getAllVouchers();
//    }
//
//
//    //! READ VOUCHER ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testGetVoucherById_whenFound_returnVoucherResponseDTO() throws Exception {
//        Mockito.when(voucherService.getVoucherById(eq(VOUCHER_ID))).thenReturn(response);
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/vouchers/{id}", VOUCHER_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk());
//        Mockito.verify(voucherService, Mockito.times(1)).getVoucherById(eq(VOUCHER_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testGetVoucherById_whenNotFound_returnNotFound() throws Exception {
//        Mockito.when(voucherService.getVoucherById(eq(VOUCHER_ID)))
//                .thenThrow(new RuntimeException("Voucher not found"));
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/vouchers/{id}", VOUCHER_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound());
//
//        Mockito.verify(voucherService, Mockito.times(1)).getVoucherById(eq(VOUCHER_ID));
//    }
//
//    //! UPDATE VOUCHER ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateVoucher_whenValidRequest_returnUpdatedVoucherResponseDTO() throws Exception {
//        Mockito.when(voucherService.updateVoucher(eq(VOUCHER_ID), eq(request))).thenReturn(response);
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/vouchers/{id}", VOUCHER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk());
//        Mockito.verify(voucherService, Mockito.times(1)).updateVoucher(eq(VOUCHER_ID), eq(request));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateVoucher_whenInvalidRequest_returnBadRequest() throws Exception {
//        Mockito.when(voucherService.updateVoucher(eq(VOUCHER_ID), any(VoucherRequestDTO.class)))
//                .thenThrow(new RuntimeException("Error updating voucher"));
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/vouchers/{id}", VOUCHER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//
//        Mockito.verify(voucherService, Mockito.times(1)).updateVoucher(eq(VOUCHER_ID), eq(request));
//    }
//
//    //! DELETE VOUCHER ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteVoucher_whenValidId_returnOk() throws Exception {
//        Mockito.doNothing().when(voucherService).deleteVoucher(VOUCHER_ID);
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/vouchers/{id}", VOUCHER_ID))
//                .andExpect(status().isOk());
//        Mockito.verify(voucherService, Mockito.times(1)).deleteVoucher(VOUCHER_ID);
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteVoucher_whenInvalidId_returnNotFound() throws Exception {
//        Mockito.doThrow(new RuntimeException("Voucher not found")).when(voucherService).deleteVoucher(VOUCHER_ID);
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/vouchers/{id}", VOUCHER_ID))
//                .andExpect(status().isNotFound());
//    }
//}
