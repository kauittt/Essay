//package com.mactiem.clothingstore.website.service;
//
//import com.mactiem.clothingstore.website.DTO.CartProductDTO;
//import com.mactiem.clothingstore.website.DTO.CartRequestDTO;
//import com.mactiem.clothingstore.website.DTO.CartResponseDTO;
//import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
//import com.mactiem.clothingstore.website.entity.Cart;
//import com.mactiem.clothingstore.website.entity.CartProduct;
//import com.mactiem.clothingstore.website.entity.CartProductId;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Product;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.entity.User;
//import com.mactiem.clothingstore.website.mapstruct.CartMapper;
//import com.mactiem.clothingstore.website.repository.CartRepository;
//import com.mactiem.clothingstore.website.validator.CartValidator;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//
///**
// * Test class for CartService.
// */
//@SpringBootTest
//public class CartServiceTest {
//
//    @Autowired
//    private CartService cartService;
//
//    @MockBean
//    private CartRepository cartRepository;
//
//    @MockBean
//    private CartMapper cartMapper;
//
//    @MockBean
//    private CartValidator cartValidator;
//
//    @MockBean
//    private ProductService productService;
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
//                                .cart(cart) // Avoiding infinite loop; can be null or set appropriately
//                                .product(Product.builder().id("product-id-456").name("T-Shirt").build())
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
//    public void testCleanCartByUserId_whenCartExists_returnOk() {
//        // GIVEN
//        // 1. Initialize the cart with a mutable cartProducts list
//        Cart mutableCart = Cart.builder()
//                .id(CART_ID)
//                .user(User.builder().id(USER_ID).username("testuser").build())
//                .cartProducts(new ArrayList<>(List.of(
//                        CartProduct.builder()
//                                .cart(null) // Avoid circular reference
//                                .product(Product.builder().id("product-id-456").name("T-Shirt").build())
//                                .quantity(2)
//                                .build()
//                )))
//                .build();
//
//        // 2. Mock cartRepository.findCartByUserId to return mutableCart
//        when(cartRepository.findCartByUserId(eq(USER_ID))).thenReturn(Optional.of(mutableCart));
//
//        // 3. Mock cartRepository.deleteProductsByCartId to do nothing
//        doNothing().when(cartRepository).deleteProductsByCartId(eq(CART_ID));
//
//        // 4. Mock cartRepository.save to return a cart with empty cartProducts
//        Cart savedCart = Cart.builder()
//                .id(CART_ID)
//                .user(mutableCart.getUser())
//                .cartProducts(new ArrayList<>()) // Empty mutable list
//                .build();
//        when(cartRepository.save(eq(mutableCart))).thenReturn(savedCart);
//
//        // 5. Mock cartMapper.toDTO to return CartResponseDTO with empty cartProducts
//        CartResponseDTO responseDTO = CartResponseDTO.builder()
//                .cartProducts(Collections.emptyList())
//                .build();
//        when(cartMapper.toDTO(eq(savedCart))).thenReturn(responseDTO);
//
//        // WHEN
//        CartResponseDTO result = cartService.cleanCartByUserId(USER_ID);
//
//        // THEN
//        assertNotNull(result, "The result should not be null");
//        assertEquals(0, result.getCartProducts().size(), "The cart should be empty after cleaning");
//
//        // Verify interactions with dependencies
//        verify(cartRepository, times(1)).findCartByUserId(eq(USER_ID));
//        verify(cartRepository, times(1)).deleteProductsByCartId(eq(CART_ID));
//        verify(cartRepository, times(1)).save(eq(mutableCart));
//        verify(cartMapper, times(1)).toDTO(eq(savedCart));
//    }
//
//
//    /**
//     * Test cleaning the cart when the cart does not exist.
//     */
//    @Test
//    public void testCleanCartByUserId_whenCartNotFound_throwException() {
//        // GIVEN
//        String nonExistentUserId = "non-existent-user-id";
//        String expectedErrorMessage = Response.notFound("Cart", nonExistentUserId);
//
//        // Mock cartRepository.findCartByUserId to return Optional.empty()
//        when(cartRepository.findCartByUserId(eq(nonExistentUserId))).thenReturn(Optional.empty());
//
//        // WHEN & THEN
//        RuntimeException exception = assertThrows(
//                RuntimeException.class,
//                () -> cartService.cleanCartByUserId(nonExistentUserId),
//                "Expected to throw RuntimeException when cart does not exist"
//        );
//
//        // Assert that the exception message matches the expected message
//        assertEquals(expectedErrorMessage, exception.getMessage(), "Exception message should match");
//
//        // Verify that cartRepository.findCartByUserId was called once with the correct USER_ID
//        verify(cartRepository, times(1)).findCartByUserId(eq(nonExistentUserId));
//
//        // Verify that deleteProductsByCartId and save were never called
//        verify(cartRepository, times(0)).deleteProductsByCartId(anyString());
//        verify(cartRepository, times(0)).save(any(Cart.class));
//
//        // Verify that cartMapper.toDTO was never called
//        verify(cartMapper, times(0)).toDTO(any(Cart.class));
//    }
//
//
//    // --- Update Cart by User ID ---
//
//    /**
//     * Test updating the cart with a valid request when the cart exists.
//     */
//    @Test
//    public void testUpdateCartByUserId_whenValidRequest_thenUpdatedCartIsReturned() {
//        // GIVEN
//        // Mock validation to do nothing (i.e., pass)
//        doNothing().when(cartValidator).validateCartRequest(eq(validRequest));
//
//        // Mock finding the cart
//        when(cartRepository.findCartByUserId(eq(USER_ID))).thenReturn(Optional.of(cart));
//
//        // Mock product service to return the product
//        Product product = Product.builder().id("product-id-456").name("T-Shirt").build();
//        when(productService.findProductsByIds(eq(validRequest.getProducts()))).thenReturn(List.of(product));
//
//        // Mock updating the cart
//        Cart updatedCart = Cart.builder()
//                .id(CART_ID)
//                .user(User.builder().id(USER_ID).username("testuser").build())
//                .cartProducts(List.of(
//                        CartProduct.builder()
//                                .cart(null) // Set to null to avoid circular reference
//                                .product(product)
//                                .quantity(4) // Updated quantity
//                                .build()
//                ))
//                .build();
//
//        // Mock saving the cart
//        when(cartRepository.save(any(Cart.class))).thenReturn(updatedCart);
//
//        // Mock mapping to DTO
//        CartResponseDTO updatedResponse = CartResponseDTO.builder()
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
//                                .quantity(4)
//                                .build()
//                ))
//                .build();
//        when(cartMapper.toDTO(eq(updatedCart))).thenReturn(updatedResponse);
//
//        // WHEN
//        CartResponseDTO result = cartService.updateCartByUserId(USER_ID, validRequest);
//
//        // THEN
//        assertNotNull(result, "The result should not be null");
//        assertEquals(1, result.getCartProducts().size(), "There should be one product in the cart");
//        assertEquals("product-id-456", result.getCartProducts().get(0).getProduct().getId(), "Product ID should match");
//        assertEquals(4, result.getCartProducts().get(0).getQuantity(), "Quantity should be updated");
//
//        verify(cartValidator, times(1)).validateCartRequest(eq(validRequest));
//        verify(cartRepository, times(1)).findCartByUserId(eq(USER_ID));
//        verify(productService, times(1)).findProductsByIds(eq(validRequest.getProducts()));
//        verify(cartRepository, times(1)).save(any(Cart.class));
//        verify(cartMapper, times(1)).toDTO(eq(updatedCart));
//    }
//
//
//    /**
//     * Test updating the cart with an invalid request (e.g., negative quantity).
//     */
//    @Test
//    public void testUpdateCartByUserId_whenInvalidRequest_throwException() {
//        // GIVEN
//        CartRequestDTO invalidRequest = CartRequestDTO.builder()
//                .products(List.of("product-id-456"))
//                .quantities(List.of("-1")) // Invalid quantity
//                .build();
//        String errorMessage = "Quantity cannot be negative for new product: product-id-456";
//
//        // Mock validation to throw exception
//        doThrow(new IllegalArgumentException(errorMessage))
//                .when(cartValidator).validateCartRequest(eq(invalidRequest));
//
//        // WHEN & THEN
//        IllegalArgumentException exception = assertThrows(
//                IllegalArgumentException.class,
//                () -> cartService.updateCartByUserId(USER_ID, invalidRequest),
//                "Expected to throw IllegalArgumentException for invalid request"
//        );
//        assertEquals(errorMessage, exception.getMessage(), "Exception message should match");
//
//        verify(cartValidator, times(1)).validateCartRequest(eq(invalidRequest));
//        verify(cartRepository, times(0)).findCartByUserId(anyString());
//        verify(productService, times(0)).findProductsByIds(anyList());
//        verify(cartRepository, times(0)).save(any(Cart.class));
//        verify(cartMapper, times(0)).toDTO(any(Cart.class));
//    }
//
//    /**
//     * Test updating the cart when the cart does not exist.
//     */
//    @Test
//    public void testUpdateCartByUserId_whenCartNotFound_throwException() {
//        // GIVEN
//        String nonExistentUserId = "non-existent-user-id";
//
//        // Mock validation to do nothing
//        doNothing().when(cartValidator).validateCartRequest(eq(validRequest));
//
//        // Mock finding the cart to return empty
//        when(cartRepository.findCartByUserId(eq(nonExistentUserId))).thenReturn(Optional.empty());
//
//        String errorMessage = "Cart not found with id: " + nonExistentUserId;
//
//        // WHEN & THEN
//        RuntimeException exception = assertThrows(
//                RuntimeException.class,
//                () -> cartService.updateCartByUserId(nonExistentUserId, validRequest),
//                "Expected to throw RuntimeException when cart does not exist"
//        );
//        assertEquals(Response.notFound("Cart", nonExistentUserId), exception.getMessage(), "Exception message should match");
//
//        verify(cartValidator, times(1)).validateCartRequest(eq(validRequest));
//        verify(cartRepository, times(1)).findCartByUserId(eq(nonExistentUserId));
//        verify(productService, times(0)).findProductsByIds(anyList());
//        verify(cartRepository, times(0)).save(any(Cart.class));
//        verify(cartMapper, times(0)).toDTO(any(Cart.class));
//    }
//}
