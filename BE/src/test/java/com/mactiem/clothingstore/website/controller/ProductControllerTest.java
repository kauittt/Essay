//package com.mactiem.clothingstore.website.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mactiem.clothingstore.website.DTO.CategoryProductsDTO;
//import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
//import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.entity.Product;
//import com.mactiem.clothingstore.website.service.ProductService;
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
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class ProductControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private ProductService productService;
//
//    private ProductRequestDTO request;
//    private ProductResponseDTO response;
//    private Product product;
//    private List<Product> productList;
//    private CategoryProductsDTO categoryProductsDTO;
//    private List<ProductResponseDTO> responseList;
//    private final String PRODUCT_ID = GenerateID.generateID();
//
//    @BeforeEach
//    public void setup() {
//        request = ProductRequestDTO.builder()
//                .name("T-Shirt")
//                .description("A cool T-Shirt")
//                .price(19.99)
//                .image("tshirt.png")
//                .stock(100)
//                .build();
//
//        product = Product.builder()
//                .id(PRODUCT_ID)
//                .name("T-Shirt")
//                .description("A cool T-Shirt")
//                .price(19.99)
//                .image("tshirt.png")
//                .stock(100)
//                .build();
//
//        response = ProductResponseDTO.builder()
//                .id(PRODUCT_ID)
//                .name("T-Shirt")
//                .description("A cool T-Shirt")
//                .price(19.99)
//                .image("tshirt.png")
//                .stock(100)
//                .feedBacks(null)
//                .build();
//
//        productList = Collections.singletonList(product);
//
//        responseList = Collections.singletonList(response);
//
//        categoryProductsDTO = CategoryProductsDTO.builder()
//                .category("Apparel")
//                .products(responseList)
//                .build();
//    }
//
//    //! GET ALL PRODUCTS ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
//    public void testGetAllProducts_whenSuccess_returnListOfProducts() throws Exception {
//        // Given
//        Mockito.when(productService.getAllProducts()).thenReturn(responseList);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(responseList.size()))
//                .andExpect(jsonPath("$[0].id").value(response.getId()))
//                .andExpect(jsonPath("$[0].name").value(response.getName()))
//                .andExpect(jsonPath("$[0].description").value(response.getDescription()))
//                .andExpect(jsonPath("$[0].price").value(response.getPrice()))
//                .andExpect(jsonPath("$[0].image").value(response.getImage()))
//                .andExpect(jsonPath("$[0].category").value(response.getCategory()))
//                .andExpect(jsonPath("$[0].stock").value(response.getStock()));
//
//        Mockito.verify(productService, Mockito.times(1)).getAllProducts();
//    }
//
//    @Test
//    @WithMockUser(username = "testuser", roles = {"ADMIN"})
//    public void testGetAllProducts_whenNoProducts_returnEmptyList() throws Exception {
//        // Given
//        Mockito.when(productService.getAllProducts()).thenReturn(List.of());
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(0));
//
//        Mockito.verify(productService, Mockito.times(1)).getAllProducts();
//    }
//
//    //! GET PRODUCT BY ID ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "testuser", roles = {"USER"})
//    public void testGetProductById_whenValidId_returnProduct() throws Exception {
//        // Given
//        Mockito.when(productService.getProductById(eq(PRODUCT_ID))).thenReturn(response);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products/{id}", PRODUCT_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(response.getId()))
//                .andExpect(jsonPath("$.name").value(response.getName()))
//                .andExpect(jsonPath("$.description").value(response.getDescription()))
//                .andExpect(jsonPath("$.price").value(response.getPrice()))
//                .andExpect(jsonPath("$.image").value(response.getImage()))
//                .andExpect(jsonPath("$.category").value(response.getCategory()))
//                .andExpect(jsonPath("$.stock").value(response.getStock()));
//
//        Mockito.verify(productService, Mockito.times(1)).getProductById(eq(PRODUCT_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "testuser", roles = {"USER"})
//    public void testGetProductById_whenProductNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Product not found with id: " + nonExistentId;
//        Mockito.when(productService.getProductById(eq(nonExistentId)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(productService, Mockito.times(1)).getProductById(eq(nonExistentId));
//    }
//
//    //! GET PRODUCTS GROUPED BY CATEGORY ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
//    public void testGetProductsGroupedByCategory_whenSuccess_returnGroupedProducts() throws Exception {
//        // Given
//        Mockito.when(productService.getProductsGroupedByCategory()).thenReturn(List.of(categoryProductsDTO));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products/grouped")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].category").value(categoryProductsDTO.getCategory()))
//                .andExpect(jsonPath("$[0].products.length()").value(categoryProductsDTO.getProducts().size()))
//                .andExpect(jsonPath("$[0].products[0].id").value(response.getId()))
//                .andExpect(jsonPath("$[0].products[0].name").value(response.getName()));
//
//        Mockito.verify(productService, Mockito.times(1)).getProductsGroupedByCategory();
//    }
//
//    @Test
//    @WithMockUser(username = "testadmin", roles = {"ADMIN"})
//    public void testGetProductsGroupedByCategory_whenNoCategories_returnEmptyList() throws Exception {
//        // Given
//        Mockito.when(productService.getProductsGroupedByCategory()).thenReturn(List.of());
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/products/grouped")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(0));
//
//        Mockito.verify(productService, Mockito.times(1)).getProductsGroupedByCategory();
//    }
//
//    //! CREATE PRODUCT ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateProduct_whenValidRequest_returnProductResponse() throws Exception {
//        // Given
//        Mockito.when(productService.createProduct(eq(request))).thenReturn(response);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/products")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(response.getId()))
//                .andExpect(jsonPath("$.name").value(response.getName()))
//                .andExpect(jsonPath("$.description").value(response.getDescription()))
//                .andExpect(jsonPath("$.price").value(response.getPrice()))
//                .andExpect(jsonPath("$.image").value(response.getImage()))
//                .andExpect(jsonPath("$.category").value(response.getCategory()))
//                .andExpect(jsonPath("$.stock").value(response.getStock()));
//
//        Mockito.verify(productService, Mockito.times(1)).createProduct(eq(request));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateProduct_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        ProductRequestDTO badRequest = ProductRequestDTO.builder()
//                .description("A cool T-Shirt without a name")
//                .price(19.99)
//                .image("tshirt.png")
//                .category("Apparel")
//                .stock(100)
//                .build();
//        String errorMessage = "Invalid product data";
//        Mockito.when(productService.createProduct(eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/products")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(productService, Mockito.times(1)).createProduct(eq(badRequest));
//    }
//
//    //! UPDATE PRODUCT ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateProduct_whenValidRequest_returnUpdatedProduct() throws Exception {
//        // Given
//        ProductResponseDTO updatedResponse = ProductResponseDTO.builder()
//                .id(PRODUCT_ID)
//                .name("Updated T-Shirt")
//                .description("An updated cool T-Shirt")
//                .price(24.99)
//                .image("updated_tshirt.png")
//                .category("Apparel")
//                .stock(80)
//                .feedBacks(null)
//                .build();
//
//        Mockito.when(productService.updateProduct(eq(PRODUCT_ID), eq(request))).thenReturn(updatedResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/products/{id}", PRODUCT_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(updatedResponse.getId()))
//                .andExpect(jsonPath("$.name").value(updatedResponse.getName()))
//                .andExpect(jsonPath("$.description").value(updatedResponse.getDescription()))
//                .andExpect(jsonPath("$.price").value(updatedResponse.getPrice()))
//                .andExpect(jsonPath("$.image").value(updatedResponse.getImage()))
//                .andExpect(jsonPath("$.category").value(updatedResponse.getCategory()))
//                .andExpect(jsonPath("$.stock").value(updatedResponse.getStock()));
//
//        Mockito.verify(productService, Mockito.times(1)).updateProduct(eq(PRODUCT_ID), eq(request));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateProduct_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        ProductRequestDTO badRequest = ProductRequestDTO.builder()
//                .description("A cool T-Shirt without a name")
//                .price(19.99)
//                .image("tshirt.png")
//                .category("Apparel")
//                .stock(100)
//                .build();
//        String errorMessage = "Invalid product data";
//        Mockito.when(productService.updateProduct(eq(PRODUCT_ID), eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/products/{id}", PRODUCT_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(productService, Mockito.times(1)).updateProduct(eq(PRODUCT_ID), eq(badRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateProduct_whenProductNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Product not found with id: " + nonExistentId;
//        Mockito.when(productService.updateProduct(eq(nonExistentId), eq(request)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/products/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest()) // Adjust based on controller's implementation
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(productService, Mockito.times(1)).updateProduct(eq(nonExistentId), eq(request));
//    }
//
//    //! DELETE PRODUCT ----------------------------------------------------------------------------------------
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteProduct_whenValidId_returnOk() throws Exception {
//        // Given
//        Mockito.doNothing().when(productService).deleteProduct(eq(PRODUCT_ID));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/products/{id}", PRODUCT_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
//                .andExpect(jsonPath("$.message").value("Deleted Product Successfully"));
//
//        Mockito.verify(productService, Mockito.times(1)).deleteProduct(eq(PRODUCT_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteProduct_whenInvalidId_returnNotFound() throws Exception {
//        // Given
//        String invalidId = "invalid-id";
//        String errorMessage = "Product not found with id: " + invalidId;
//        Mockito.doThrow(new RuntimeException(errorMessage))
//                .when(productService).deleteProduct(eq(invalidId));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/products/{id}", invalidId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(productService, Mockito.times(1)).deleteProduct(eq(invalidId));
//    }
//}
