//package com.mactiem.clothingstore.website.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mactiem.clothingstore.website.DTO.CartProductDTO;
//import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
//import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
//import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
//import com.mactiem.clothingstore.website.entity.Cart;
//import com.mactiem.clothingstore.website.entity.CartProduct;
//import com.mactiem.clothingstore.website.entity.CartProductId;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Product;
//import com.mactiem.clothingstore.website.entity.User;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.service.CartService;
//import com.mactiem.clothingstore.website.service.ProductService;
//import com.mactiem.clothingstore.website.service.UserService;
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
//import java.util.Optional;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.times;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
///**
// * Test class for CartController.
// */
//@SpringBootTest
//@AutoConfigureMockMvc
//public class CartControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private CartService cartService;
//
//    private CartRequestDTO validRequest;
//    private CartResponseDTO validResponse;
//    private Cart cart;
//    private List<Cart> cartList;
//    private List<CartResponseDTO> responseList;
//    private final String CART_ID = GenerateID.generateID();
//    private final String USER_ID = "user-id-123";
//
//    /**
//     * Setup common test data before each test.
//     */
//    @BeforeEach
//    public void setup() {
//
//        Product product = Product.builder().id("product-id-456").name("T-Shirt").build();
//        // Initialize CartRequestDTO (Valid Request)
//        validRequest = CartRequestDTO.builder()
//                .products(List.of("product-id-456"))
//                .quantities(List.of("2"))
//                .build();
//
//        // Initialize Cart entity
//        cart = Cart.builder()
//                .id(CART_ID)
//                .user(User.builder().id(USER_ID).username("testuser").build())
//                .cartProducts(Collections.singletonList(
//                        CartProduct.builder()
//                                .cart(new Cart())
//                                .product(product)
//                                .quantity(2)
//                                .build()
//                ))
//                .build();
//
//        // Initialize CartResponseDTO
//        validResponse = CartResponseDTO.builder()
//                .cartProducts(List.of(
//                        CartProductDTO.builder()
//                                .product(ProductResponseDTO.builder()
//                                        .id("product-id-456")
//                                        .name("T-Shirt")
//                                        .description("A cool T-Shirt")
//                                        .price(19.99)
//                                        .image("tshirt.png")
//                                        .category("Apparel")
//                                        .stock(100)
//                                        .build())
//                                .quantity(2)
//                                .build()
//                ))
//                .build();
//
//        // Initialize list of Carts
//        cartList = Collections.singletonList(cart);
//
//        // Initialize list of CartResponseDTOs
//        responseList = Collections.singletonList(validResponse);
//    }
//
//    // --- Clean Cart by User ID ---
//
//    /**
//     * Test cleaning the cart when the cart exists.
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCleanCartByUserId_whenCartExists_returnOk() throws Exception {
//        // GIVEN
//        Mockito.when(cartService.cleanCartByUserId(eq(USER_ID))).thenReturn(validResponse);
//
//        // WHEN & THEN
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/carts/clean/{id}", USER_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.cartProducts.length()").value(1))
//                .andExpect(jsonPath("$.cartProducts[0].product.id").value("product-id-456"))
//                .andExpect(jsonPath("$.cartProducts[0].quantity").value(2));
//
//        Mockito.verify(cartService, times(1)).cleanCartByUserId(eq(USER_ID));
//    }
//
//    /**
//     * Test cleaning the cart when the cart does not exist.
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCleanCartByUserId_whenCartNotFound_returnNotFound() throws Exception {
//        // GIVEN
//        String nonExistentUserId = "non-existent-user-id";
//        String errorMessage = "Cart not found with ID: " + nonExistentUserId;
//
//        Mockito.when(cartService.cleanCartByUserId(eq(nonExistentUserId)))
//                .thenThrow(new RuntimeException(Response.notFound("Cart", nonExistentUserId)));
//
//        // WHEN & THEN
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/carts/clean/{id}", nonExistentUserId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(cartService, times(1)).cleanCartByUserId(eq(nonExistentUserId));
//    }
//
//    // --- Update Cart by User ID ---
//
//    /**
//     * Test updating the cart with a valid request when the cart exists.
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateCartByUserId_whenValidRequest_thenUpdatedCartIsReturned() throws Exception {
//        // GIVEN
//        Mockito.when(cartService.updateCartByUserId(eq(USER_ID), eq(validRequest))).thenReturn(validResponse);
//
//        // WHEN & THEN
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/carts/{id}", USER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.cartProducts.length()").value(1))
//                .andExpect(jsonPath("$.cartProducts[0].product.id").value("product-id-456"))
//                .andExpect(jsonPath("$.cartProducts[0].quantity").value(2));
//
//        Mockito.verify(cartService, times(1)).updateCartByUserId(eq(USER_ID), eq(validRequest));
//    }
//
//    /**
//     * Test updating the cart with an invalid request, expecting a Bad Request response.
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateCartByUserId_whenInvalidRequest_thenBadRequest() throws Exception {
//        // GIVEN
//        CartRequestDTO invalidRequest = CartRequestDTO.builder()
//                .products(List.of("")) // Invalid product ID
//                .quantities(List.of("-1")) // Invalid quantity
//                .build();
//        String errorMessage = "Quantity cannot be negative for new product: ";
//        Mockito.when(cartService.updateCartByUserId(eq(USER_ID), eq(invalidRequest)))
//                .thenThrow(new IllegalArgumentException(errorMessage + "product-id-456"));
//
//        // WHEN & THEN
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/carts/{id}", USER_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage + "product-id-456"));
//
//        Mockito.verify(cartService, times(1)).updateCartByUserId(eq(USER_ID), eq(invalidRequest));
//    }
//
//    /**
//     * Test updating the cart when the cart does not exist, expecting a Bad Request response.
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateCartByUserId_whenCartNotFound_thenBadRequest() throws Exception {
//        // GIVEN
//        String nonExistentUserId = "non-existent-user-id";
//        String errorMessage = "Cart not found with ID: " + nonExistentUserId;
//        Mockito.when(cartService.updateCartByUserId(eq(nonExistentUserId), eq(validRequest)))
//                .thenThrow(new RuntimeException(Response.notFound("Cart", nonExistentUserId)));
//
//        // WHEN & THEN
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/carts/{id}", nonExistentUserId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isBadRequest()) // Based on controller's implementation, it maps to 404
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(cartService, times(1)).updateCartByUserId(eq(nonExistentUserId), eq(validRequest));
//    }
//}
