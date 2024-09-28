package com.mactiem.clothingstore.website.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.CategoryProductsDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private ProductMapper productMapper;

    @MockBean
    private ProductValidator productValidator;

    private ProductRequestDTO request;
    private ProductResponseDTO response;
    private Product product;
    private List<Product> productList;
    private CategoryProductsDTO categoryProductsDTO;
    private List<ProductResponseDTO> responseList;
    private final String PRODUCT_ID = GenerateID.generateID();

    @BeforeEach
    public void setup() {
        // Initialize ProductRequestDTO (Valid Request)
        request = ProductRequestDTO.builder()
                .name("T-Shirt")
                .description("A cool T-Shirt")
                .price(19.99)
                .image("tshirt.png")
                .category("Apparel")
                .stock(100)
                .build();

        // Initialize Product entity
        product = Product.builder()
                .id(PRODUCT_ID)
                .name("T-Shirt")
                .description("A cool T-Shirt")
                .price(19.99)
                .image("tshirt.png")
                .category("Apparel")
                .stock(100)
                .build();

        // Initialize ProductResponseDTO
        response = ProductResponseDTO.builder()
                .id(PRODUCT_ID)
                .name("T-Shirt")
                .description("A cool T-Shirt")
                .price(19.99)
                .image("tshirt.png")
                .category("Apparel")
                .stock(100)
                .feedBacks(null) // Assuming no feedbacks initially
                .build();

        // Initialize list of Products
        productList = Collections.singletonList(product);

        // Initialize list of ProductResponseDTO
        responseList = Collections.singletonList(response);

        // Initialize CategoryProductsDTO
        categoryProductsDTO = CategoryProductsDTO.builder()
                .category("Apparel")
                .products(responseList)
                .build();
    }

    // --- Get All Products ---
    @Test
    public void testGetAllProducts_whenProductsExist_returnListOfProductResponseDTOs() {
        // GIVEN
        when(productRepository.findAll()).thenReturn(productList);
        when(productMapper.toListDTOs(productList)).thenReturn(responseList);

        // WHEN
        List<ProductResponseDTO> result = productService.getAllProducts();

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("T-Shirt", result.get(0).getName());

        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(1)).toListDTOs(productList);
    }

    @Test
    public void testGetAllProducts_whenNoProductsExist_returnEmptyList() {
        // GIVEN
        when(productRepository.findAll()).thenReturn(Collections.emptyList());
        when(productMapper.toListDTOs(Collections.emptyList())).thenReturn(Collections.emptyList());

        // WHEN
        List<ProductResponseDTO> result = productService.getAllProducts();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(1)).toListDTOs(Collections.emptyList());
    }

    // --- Get Product By ID ---
    @Test
    public void testGetProductById_whenProductExists_returnProductResponseDTO() {
        // GIVEN
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        when(productMapper.toDTO(product)).thenReturn(response);

        // WHEN
        ProductResponseDTO result = productService.getProductById(PRODUCT_ID);

        // THEN
        assertNotNull(result);
        assertEquals("T-Shirt", result.getName());
        assertEquals("Apparel", result.getCategory());

        verify(productRepository, times(1)).findById(PRODUCT_ID);
        verify(productMapper, times(1)).toDTO(product);
    }

    @Test
    public void testGetProductById_whenProductDoesNotExist_throwException() {
        // GIVEN
        String nonExistentId = "non-existent-id";
        when(productRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> productService.getProductById(nonExistentId));
        assertEquals(Response.notFound("Product", nonExistentId), exception.getMessage());

        verify(productRepository, times(1)).findById(nonExistentId);
        verify(productMapper, times(0)).toDTO(any());
    }

    // --- Get Products Grouped By Category ---
    @Test
    public void testGetProductsGroupedByCategory_whenProductsExist_returnGroupedCategoryProductsDTOs() {
        // GIVEN
        when(productMapper.toListDTOs(productList)).thenReturn(responseList);
        when(productRepository.findAll()).thenReturn(productList);

        // WHEN
        List<CategoryProductsDTO> result = productService.getProductsGroupedByCategory();

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Apparel", result.get(0).getCategory());
        assertEquals(1, result.get(0).getProducts().size());
        assertEquals("T-Shirt", result.get(0).getProducts().get(0).getName());

        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(1)).toListDTOs(productList);
    }

    @Test
    public void testGetProductsGroupedByCategory_whenNoProductsExist_returnEmptyList() {
        // GIVEN
        when(productMapper.toListDTOs(Collections.emptyList())).thenReturn(Collections.emptyList());
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        // WHEN
        List<CategoryProductsDTO> result = productService.getProductsGroupedByCategory();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(1)).toListDTOs(Collections.emptyList());
    }

    // --- Create Product ---
    @Test
    public void testCreateProduct_whenValidRequest_thenProductIsCreated() {
        // GIVEN
        Mockito.doNothing().when(productValidator).validateProductRequest(eq(request));
        when(productMapper.toEntity(request)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(response);

        // WHEN
        ProductResponseDTO result = productService.createProduct(request);

        // THEN
        assertNotNull(result);
        assertEquals("T-Shirt", result.getName());
        assertEquals("Apparel", result.getCategory());

        verify(productValidator, times(1)).validateProductRequest(request);
        verify(productMapper, times(1)).toEntity(request);
        verify(productRepository, times(1)).save(product);
        verify(productMapper, times(1)).toDTO(product);
    }

    @Test
    public void testCreateProduct_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Product name is required";
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(productValidator).validateProductRequest(any(ProductRequestDTO.class));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> productService.createProduct(request)
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(errorMessage, exception.getReason());

        verify(productValidator, times(1)).validateProductRequest(request);
        verify(productMapper, times(0)).toEntity(any());
        verify(productRepository, times(0)).save(any());
        verify(productMapper, times(0)).toDTO(any());
    }

    // --- Update Product ---
    @Test
    public void testUpdateProduct_whenValidRequest_thenProductIsUpdated() throws NoSuchFieldException, IllegalAccessException {
        // GIVEN
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        Mockito.doNothing().when(productValidator).validateUpdate(eq(request));


        Product updatedProduct = Product.builder()
                .id(PRODUCT_ID)
                .name("Updated T-Shirt")
                .description("An updated cool T-Shirt")
                .price(24.99)
                .image("updated_tshirt.png")
                .category("Apparel")
                .stock(80)
                .build();

        // Capture the product being saved to verify updates
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        when(productMapper.toDTO(updatedProduct)).thenReturn(
                ProductResponseDTO.builder()
                        .id(PRODUCT_ID)
                        .name("Updated T-Shirt")
                        .description("An updated cool T-Shirt")
                        .price(24.99)
                        .image("updated_tshirt.png")
                        .category("Apparel")
                        .stock(80)
                        .feedBacks(null)
                        .build()
        );

        // WHEN
        ProductResponseDTO result = productService.updateProduct(PRODUCT_ID, request);

        // THEN
        assertNotNull(result);
        assertEquals("Updated T-Shirt", result.getName());
        assertEquals(24.99, result.getPrice());

        verify(productRepository, times(1)).findById(PRODUCT_ID);
        verify(productValidator, times(1)).validateUpdate(request);
        verify(productRepository, times(1)).save(product);
        verify(productMapper, times(1)).toDTO(updatedProduct);
    }

    @Test
    public void testUpdateProduct_whenProductDoesNotExist_throwException() {
        // GIVEN
        String nonExistentId = "non-existent-id";
        when(productRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.updateProduct(nonExistentId, request)
        );
        assertEquals(Response.notFound("Product", nonExistentId), exception.getMessage());

        verify(productRepository, times(1)).findById(nonExistentId);
        verify(productValidator, times(0)).validateUpdate(any());
        verify(productRepository, times(0)).save(any());
        verify(productMapper, times(0)).toDTO(any());
    }

    @Test
    public void testUpdateProduct_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Product price must be positive";

        // Mock findById to return the product
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));

        // Mock validateUpdate to throw ResponseStatusException
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(productValidator).validateUpdate(any(ProductRequestDTO.class));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> productService.updateProduct(PRODUCT_ID, request)
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(errorMessage, exception.getReason());

        verify(productRepository, times(1)).findById(PRODUCT_ID);
        verify(productValidator, times(1)).validateUpdate(request);
        verify(productRepository, times(0)).save(any());
        verify(productMapper, times(0)).toDTO(any());
    }


    // --- Delete Product ---
    @Test
    public void testDeleteProduct_whenProductExists_thenProductIsDeleted() {
        // GIVEN
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        doNothing().when(productRepository).delete(product);

        // WHEN
        productService.deleteProduct(PRODUCT_ID);

        // THEN
        verify(productRepository, times(1)).findById(PRODUCT_ID);
        verify(productRepository, times(1)).delete(product);
    }

    @Test
    public void testDeleteProduct_whenProductDoesNotExist_throwException() {
        // GIVEN
        String nonExistentId = "non-existent-id";
        when(productRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.deleteProduct(nonExistentId)
        );
        assertEquals(Response.notFound("Product", nonExistentId), exception.getMessage());

        verify(productRepository, times(1)).findById(nonExistentId);
        verify(productRepository, times(0)).delete(any());
    }

}
