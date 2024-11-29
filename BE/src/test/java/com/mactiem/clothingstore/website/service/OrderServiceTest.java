package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
import com.mactiem.clothingstore.website.DTO.OrderResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.OrderMapper;
import com.mactiem.clothingstore.website.repository.OrderRepository;
import com.mactiem.clothingstore.website.validator.OrderValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderServiceTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderService orderService;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private OrderMapper orderMapper;

    @MockBean
    private OrderValidator orderValidator;

    @MockBean
    private ProductService productService;

    @MockBean
    private InvoiceService invoiceService;

    private OrderRequestDTO validRequest;
    private OrderResponseDTO validResponse;
    private Order order;
    private List<Order> orderList;
    private List<OrderResponseDTO> responseList;
    private final long ORDER_ID = 1L;

    @BeforeEach
    public void setup() {
        // Initialize OrderRequestDTO (Valid Request)
        validRequest = OrderRequestDTO.builder()
                .user("1")
                .products(List.of("1", "2"))
                .quantities(List.of("2", "3"))
                .name("John Doe")
                .phone("1234567890")
                .address("123 Main St, Cityville")
                .status("PENDING")
                .build();

        // Initialize Order entity
        order = Order.builder()
                .id(ORDER_ID)
                .name("John Doe")
                .phone("1234567890")
                .address("123 Main St, Cityville")
                .status("PENDING")
                .createDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .build();

        // Initialize OrderResponseDTO
        validResponse = OrderResponseDTO.builder()
                .id(ORDER_ID)
                .name("John Doe")
                .phone("1234567890")
                .address("123 Main St, Cityville")
                .status("PENDING")
                .createDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .orderProducts(null) // Assuming no order products initially
                .invoice(null) // Assuming no invoice initially
                .build();

        // Initialize list of Orders
        orderList = Collections.singletonList(order);

        // Initialize list of OrderResponseDTO
        responseList = Collections.singletonList(validResponse);
    }

    // --- Get All Orders ---
    @Test
    public void testGetAllOrders_whenOrdersExist_returnListOfOrderResponseDTOs() {
        // GIVEN
        when(orderRepository.findAll()).thenReturn(orderList);
        when(orderMapper.toListDTOs(orderList)).thenReturn(responseList);

        // WHEN
        List<OrderResponseDTO> result = orderService.getAllOrders();

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getName());

        verify(orderRepository, times(1)).findAll();
        verify(orderMapper, times(1)).toListDTOs(orderList);
    }

    @Test
    public void testGetAllOrders_whenNoOrdersExist_returnEmptyList() {
        // GIVEN
        when(orderRepository.findAll()).thenReturn(Collections.emptyList());
        when(orderMapper.toListDTOs(Collections.emptyList())).thenReturn(Collections.emptyList());

        // WHEN
        List<OrderResponseDTO> result = orderService.getAllOrders();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(orderRepository, times(1)).findAll();
        verify(orderMapper, times(1)).toListDTOs(Collections.emptyList());
    }

    // --- Get Order By ID ---
    @Test
    public void testGetOrderById_whenOrderExists_returnOrderResponseDTO() {
        // GIVEN
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(orderMapper.toDTO(order)).thenReturn(validResponse);

        // WHEN
        OrderResponseDTO result = orderService.getOrderById(ORDER_ID+"");

        // THEN
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("PENDING", result.getStatus());

        verify(orderRepository, times(1)).findById(ORDER_ID);
        verify(orderMapper, times(1)).toDTO(order);
    }

    @Test
    public void testGetOrderById_whenOrderDoesNotExist_throwException() {
        // GIVEN
        long nonExistentId =1L;
        when(orderRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> orderService.getOrderById(nonExistentId+""));
        assertEquals(Response.notFound("Order", nonExistentId+""), exception.getMessage());

        verify(orderRepository, times(1)).findById(nonExistentId);
        verify(orderMapper, times(0)).toDTO(any());
    }

    // --- Create Order ---
    @Test
    public void testCreateOrder_whenValidRequest_thenOrderIsCreated() {
        // GIVEN
        Mockito.doNothing().when(orderValidator).validateOrderRequest(eq(validRequest));
        when(orderMapper.toEntity(validRequest)).thenReturn(order);
//        when(orderMapper.mapOrderProductsEntity(order, validRequest, productService)).thenReturn(order);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toDTO(order)).thenReturn(validResponse);

        // WHEN
        OrderResponseDTO result = orderService.createOrder(validRequest);

        // THEN
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("PENDING", result.getStatus());

        verify(orderValidator, times(1)).validateOrderRequest(validRequest);
        verify(orderMapper, times(1)).toEntity(validRequest);
//        verify(orderMapper, times(1)).mapOrderProductsEntity(order, validRequest, productService);
        verify(orderRepository, times(1)).save(order);
        verify(orderMapper, times(1)).toDTO(order);
    }

    @Test
    public void testCreateOrder_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Invalid order data";
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(orderValidator).validateOrderRequest(any(OrderRequestDTO.class));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orderService.createOrder(validRequest)
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(errorMessage, exception.getReason());

        verify(orderValidator, times(1)).validateOrderRequest(validRequest);
        verify(orderMapper, times(0)).toEntity(any());
        verify(orderRepository, times(0)).save(any());
        verify(orderMapper, times(0)).toDTO(any());
    }

    // --- Update Order ---
    @Test
    public void testUpdate_whenValidRequest_thenOrderIsUpdated() {
        // GIVEN
        Order updatedOrder = Order.builder()
                .id(ORDER_ID)
                .name("Jane Doe")
                .phone("0987654321")
                .address("456 Elm St, Townsville")
                .status("PROCESSING")
                .createDate(order.getCreateDate())
                .updateDate(LocalDateTime.now())
                .build();

        OrderResponseDTO updatedResponse = OrderResponseDTO.builder()
                .id(ORDER_ID)
                .name("Jane Doe")
                .phone("0987654321")
                .address("456 Elm St, Townsville")
                .status("PROCESSING")
                .createDate(order.getCreateDate())
                .updateDate(LocalDateTime.now())
                .orderProducts(null)
                .invoice(null)
                .build();

        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        doNothing().when(orderValidator).validateUpdate(eq(validRequest));
        when(orderRepository.save(order)).thenReturn(updatedOrder);
        when(orderMapper.toDTO(updatedOrder)).thenReturn(updatedResponse);

        // WHEN
        OrderResponseDTO result = orderService.update(ORDER_ID+"", validRequest);

        // THEN
        assertNotNull(result);
        assertEquals("Jane Doe", result.getName());
        assertEquals("PROCESSING", result.getStatus());

        verify(orderRepository, times(1)).findById(ORDER_ID);
        verify(orderValidator, times(1)).validateUpdate(validRequest);
        verify(orderRepository, times(1)).save(order);
        verify(orderMapper, times(1)).toDTO(updatedOrder);
    }

    @Test
    public void testUpdate_whenOrderDoesNotExist_throwException() {
        // GIVEN
        long nonExistentId =1L;
        when(orderRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> orderService.update(nonExistentId+"", validRequest)
        );
        assertEquals(Response.notFound("Order", nonExistentId+""), exception.getMessage());

        verify(orderRepository, times(1)).findById(nonExistentId);
        verify(orderValidator, times(0)).validateUpdate(any());
        verify(orderRepository, times(0)).save(any());
        verify(orderMapper, times(0)).toDTO(any());
    }

    @Test
    public void testUpdate_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Invalid update data";
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(orderValidator).validateUpdate(any(OrderRequestDTO.class));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orderService.update(ORDER_ID+"", validRequest)
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(errorMessage, exception.getReason());

        verify(orderRepository, times(1)).findById(ORDER_ID);
        verify(orderValidator, times(1)).validateUpdate(validRequest);
        verify(orderRepository, times(0)).save(any());
        verify(orderMapper, times(0)).toDTO(any());
    }

    @Test
    public void testUpdate_whenOrderStatusDone_thenReturnNull() {
        // GIVEN
        order.setStatus("DONE");
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));

        // WHEN
        OrderResponseDTO result = orderService.update(ORDER_ID+"", validRequest);

        // THEN
        assertNull(result);

        verify(orderRepository, times(1)).findById(ORDER_ID);
        verify(orderValidator, times(0)).validateUpdate(any());
        verify(orderRepository, times(0)).save(any());
        verify(orderMapper, times(0)).toDTO(any());
    }

    // --- Delete Order ---
    @Test
    public void testDelete_whenOrderExists_thenOrderIsDeleted() {
        // GIVEN
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        doNothing().when(orderRepository).delete(order);

        // WHEN
        orderService.delete(ORDER_ID+"");

        // THEN
        verify(orderRepository, times(1)).findById(ORDER_ID);
        verify(orderRepository, times(1)).delete(order);
    }

    @Test
    public void testDelete_whenOrderDoesNotExist_throwException() {
        // GIVEN
        long nonExistentId =1L;
        when(orderRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> orderService.delete(nonExistentId+"")
        );
        assertEquals(Response.notFound("Order", nonExistentId+""), exception.getMessage());

        verify(orderRepository, times(1)).findById(nonExistentId);
        verify(orderRepository, times(0)).delete(any());
    }

}
