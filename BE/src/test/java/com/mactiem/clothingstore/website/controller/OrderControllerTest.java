//package com.mactiem.clothingstore.website.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
//import com.mactiem.clothingstore.website.DTO.OrderResponseDTO;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Invoice;
//import com.mactiem.clothingstore.website.entity.Order;
//import com.mactiem.clothingstore.website.entity.OrderProduct;
//import com.mactiem.clothingstore.website.service.OrderService;
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
//
//import java.time.LocalDate;
//import java.util.Collections;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class OrderControllerTest {
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private OrderService orderService;
//
//    private OrderRequestDTO validRequest;
//    private OrderResponseDTO validResponse;
//    private Order order;
//    private List<Order> orderList;
//    private List<OrderResponseDTO> responseList;
//    private final String ORDER_ID = GenerateID.generateID();
//
//    @BeforeEach
//    public void setup() {
//        // Initialize OrderRequestDTO (Valid Request)
//        validRequest = OrderRequestDTO.builder()
//                .user("user-id-123")
//                .products(List.of("product-id-1", "product-id-2"))
//                .quantities(List.of("2", "3"))
//                .name("John Doe")
//                .phone("1234567890")
//                .address("123 Main St, Cityville")
//                .status("PENDING")
//                .build();
//
//        // Initialize Order entity
//        order = Order.builder()
//                .id(ORDER_ID)
//                .name("John Doe")
//                .phone("1234567890")
//                .address("123 Main St, Cityville")
//                .status("PENDING")
//                .createDate(LocalDate.now())
//                .updateDate(LocalDate.now())
//                .build();
//
//        // Initialize OrderResponseDTO
//        validResponse = OrderResponseDTO.builder()
//                .id(ORDER_ID)
//                .name("John Doe")
//                .phone("1234567890")
//                .address("123 Main St, Cityville")
//                .status("PENDING")
//                .createDate(LocalDate.now())
//                .updateDate(LocalDate.now())
//                .orderProducts(null) // Assuming no order products initially
//                .invoice(null) // Assuming no invoice initially
//                .build();
//
//        // Initialize list of Orders
//        orderList = Collections.singletonList(order);
//
//        // Initialize list of OrderResponseDTO
//        responseList = Collections.singletonList(validResponse);
//    }
//
//    // --- GET ALL ORDERS ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
//    public void testGetAllOrders_whenSuccess_returnListOfOrders() throws Exception {
//        // Given
//        Mockito.when(orderService.getAllOrders()).thenReturn(responseList);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/orders")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(responseList.size()))
//                .andExpect(jsonPath("$[0].id").value(validResponse.getId()))
//                .andExpect(jsonPath("$[0].name").value(validResponse.getName()))
//                .andExpect(jsonPath("$[0].phone").value(validResponse.getPhone()))
//                .andExpect(jsonPath("$[0].address").value(validResponse.getAddress()))
//                .andExpect(jsonPath("$[0].status").value(validResponse.getStatus()))
//                .andExpect(jsonPath("$[0].createDate").value(validResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$[0].updateDate").value(validResponse.getUpdateDate().toString()))
//        // Add more assertions if needed for nested objects
//        ;
//
//        Mockito.verify(orderService, Mockito.times(1)).getAllOrders();
//    }
//
//    @Test
//    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
//    public void testGetAllOrders_whenNoOrders_returnEmptyList() throws Exception {
//        // Given
//        Mockito.when(orderService.getAllOrders()).thenReturn(List.of());
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/orders")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(0));
//
//        Mockito.verify(orderService, Mockito.times(1)).getAllOrders();
//    }
//
//    // --- GET ORDER BY ID ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "testuser", roles = {"USER"})
//    public void testGetOrderById_whenValidId_returnOrder() throws Exception {
//        // Given
//        Mockito.when(orderService.getOrderById(eq(ORDER_ID))).thenReturn(validResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/orders/{id}", ORDER_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(validResponse.getId()))
//                .andExpect(jsonPath("$.name").value(validResponse.getName()))
//                .andExpect(jsonPath("$.phone").value(validResponse.getPhone()))
//                .andExpect(jsonPath("$.address").value(validResponse.getAddress()))
//                .andExpect(jsonPath("$.status").value(validResponse.getStatus()))
//                .andExpect(jsonPath("$.createDate").value(validResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$.updateDate").value(validResponse.getUpdateDate().toString()));
//        // Add more assertions if needed for nested objects
//
//        Mockito.verify(orderService, Mockito.times(1)).getOrderById(eq(ORDER_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "testuser", roles = {"USER"})
//    public void testGetOrderById_whenOrderNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Order not found with id: " + nonExistentId;
//        Mockito.when(orderService.getOrderById(eq(nonExistentId)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/orders/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(orderService, Mockito.times(1)).getOrderById(eq(nonExistentId));
//    }
//
//    // --- CREATE ORDER ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateOrder_whenValidRequest_returnOrderResponse() throws Exception {
//        // Given
//        Mockito.when(orderService.createOrder(eq(validRequest))).thenReturn(validResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/orders")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(validResponse.getId()))
//                .andExpect(jsonPath("$.name").value(validResponse.getName()))
//                .andExpect(jsonPath("$.phone").value(validResponse.getPhone()))
//                .andExpect(jsonPath("$.address").value(validResponse.getAddress()))
//                .andExpect(jsonPath("$.status").value(validResponse.getStatus()))
//                .andExpect(jsonPath("$.createDate").value(validResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$.updateDate").value(validResponse.getUpdateDate().toString()));
//        // Add more assertions if needed for nested objects
//
//        Mockito.verify(orderService, Mockito.times(1)).createOrder(eq(validRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateOrder_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        OrderRequestDTO badRequest = OrderRequestDTO.builder()
//                .user("user-id-123")
//                .products(List.of()) // Empty products list to simulate invalid request
//                .quantities(List.of())
//                .name("") // Invalid name
//                .phone("1234567890")
//                .address("123 Main St, Cityville")
//                .status("PENDING")
//                .build();
//        String errorMessage = "Invalid order data";
//        Mockito.when(orderService.createOrder(eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/orders")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(orderService, Mockito.times(1)).createOrder(eq(badRequest));
//    }
//
//    // --- UPDATE ORDER ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateOrder_whenValidRequest_returnUpdatedOrder() throws Exception {
//        // Given
//        OrderResponseDTO updatedResponse = OrderResponseDTO.builder()
//                .id(ORDER_ID)
//                .name("Jane Doe")
//                .phone("0987654321")
//                .address("456 Elm St, Townsville")
//                .status("PROCESSING")
//                .createDate(validResponse.getCreateDate())
//                .updateDate(LocalDate.now())
//                .orderProducts(null)
//                .invoice(null)
//                .build();
//
//        Mockito.when(orderService.update(eq(ORDER_ID), eq(validRequest))).thenReturn(updatedResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/orders/{id}", ORDER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(updatedResponse.getId()))
//                .andExpect(jsonPath("$.name").value(updatedResponse.getName()))
//                .andExpect(jsonPath("$.phone").value(updatedResponse.getPhone()))
//                .andExpect(jsonPath("$.address").value(updatedResponse.getAddress()))
//                .andExpect(jsonPath("$.status").value(updatedResponse.getStatus()))
//                .andExpect(jsonPath("$.createDate").value(updatedResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$.updateDate").value(updatedResponse.getUpdateDate().toString()));
//        // Add more assertions if needed for nested objects
//
//        Mockito.verify(orderService, Mockito.times(1)).update(eq(ORDER_ID), eq(validRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateOrder_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        OrderRequestDTO badRequest = OrderRequestDTO.builder()
//                .user("user-id-123")
//                .products(List.of("product-id-1"))
//                .quantities(List.of("0")) // Invalid quantity
//                .name("Jane Doe")
//                .phone("0987654321")
//                .address("456 Elm St, Townsville")
//                .status("PROCESSING")
//                .build();
//        String errorMessage = "Invalid order data";
//        Mockito.when(orderService.update(eq(ORDER_ID), eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/orders/{id}", ORDER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(orderService, Mockito.times(1)).update(eq(ORDER_ID), eq(badRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateOrder_whenOrderNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Order not found with id: " + nonExistentId;
//        Mockito.when(orderService.update(eq(nonExistentId), eq(validRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/orders/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isBadRequest()) // Adjust based on controller's implementation
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(orderService, Mockito.times(1)).update(eq(nonExistentId), eq(validRequest));
//    }
//
//    // --- DELETE ORDER ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteOrder_whenValidId_returnOk() throws Exception {
//        // Given
//        Mockito.doNothing().when(orderService).delete(eq(ORDER_ID));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/orders/{id}", ORDER_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
//                .andExpect(jsonPath("$.message").value("Deleted Order Successfully"));
//
//        Mockito.verify(orderService, Mockito.times(1)).delete(eq(ORDER_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteOrder_whenOrderNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Order not found with id: " + nonExistentId;
//        Mockito.doThrow(new RuntimeException(errorMessage))
//                .when(orderService).delete(eq(nonExistentId));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/orders/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(orderService, Mockito.times(1)).delete(eq(nonExistentId));
//    }
//}
