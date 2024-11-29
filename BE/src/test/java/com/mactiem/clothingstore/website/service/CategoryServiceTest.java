package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CategoryRequestDTO;
import com.mactiem.clothingstore.website.DTO.CategoryResponseDTO;
import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.CategoryMapper;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.validator.CategoryValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private CategoryValidator categoryValidator;

    @InjectMocks
    private CategoryService categoryService;

    private CategoryRequestDTO validRequest;
    private CategoryResponseDTO validResponse;
    private Category category;

    private static final Long CATEGORY_ID = 1L;
    private static final String INVALID_CATEGORY_ID = "999";

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Initialize CategoryRequestDTO (Valid Request)
        validRequest = CategoryRequestDTO.builder()
                .name("Category 1")
                .enName("Category 1 English")
                .build();

        // Initialize Category entity
        category = Category.builder()
                .id(CATEGORY_ID)
                .name("Category 1")
                .enName("Category 1 English")
                .build();

        // Initialize CategoryResponseDTO
        validResponse = CategoryResponseDTO.builder()
                .id(CATEGORY_ID)
                .name("Category 1")
                .enName("Category 1 English")
                .build();
    }

    // Test GET all categories
//    @Test
//    public void testGetAllCategories_whenCategoriesExist_returnCategoryList() {
//        // GIVEN
//        List<Category> categories = List.of(category);
//        List<CategoryResponseDTO> responseList = List.of(validResponse);
//
//        // Mocking the repository and mapper
//        when(categoryRepository.findAll(any())).thenReturn(categories); // Fix: Add Sort parameter
//        when(categoryMapper.toListDTOs(categories)).thenReturn(responseList);
//
//        // WHEN
//        List<CategoryResponseDTO> result = categoryService.getAllCategories();
//
//        // THEN
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals("Category 1", result.get(0).getName());
//
//        verify(categoryRepository, times(1)).findAll(any()); // Verify the correct arguments passed
//        verify(categoryMapper, times(1)).toListDTOs(categories);
//    }

//    @Test
//    public void testGetAllCategories_whenNoCategoriesExist_returnEmptyList() {
//        // GIVEN
//        List<Category> categories = Collections.emptyList();
//        List<CategoryResponseDTO> responseList = Collections.emptyList();
//
//        when(categoryRepository.findAll(any())).thenReturn(categories); // Fix: Add Sort parameter
//        when(categoryMapper.toListDTOs(categories)).thenReturn(responseList);
//
//        // WHEN
//        List<CategoryResponseDTO> result = categoryService.getAllCategories();
//
//        // THEN
//        assertNotNull(result);
//        assertTrue(result.isEmpty());
//
//        verify(categoryRepository, times(1)).findAll(any()); // Verify the correct arguments passed
//        verify(categoryMapper, times(1)).toListDTOs(categories);
//    }

    // Test GET Category by ID
    @Test
    public void testGetCategoryById_whenCategoryExists_returnCategoryResponseDTO() {
        // GIVEN
        when(categoryRepository.findById(eq(CATEGORY_ID))).thenReturn(Optional.of(category));
        when(categoryMapper.toDTO(category)).thenReturn(validResponse);

        // WHEN
        CategoryResponseDTO result = categoryService.getCategoryById(CATEGORY_ID.toString());

        // THEN
        assertNotNull(result);
        assertEquals("Category 1", result.getName());

        verify(categoryRepository, times(1)).findById(eq(CATEGORY_ID));
        verify(categoryMapper, times(1)).toDTO(category);
    }

    @Test
    public void testGetCategoryById_whenCategoryDoesNotExist_throwException() {
        // GIVEN
        when(categoryRepository.findById(eq(Long.valueOf(INVALID_CATEGORY_ID)))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.getCategoryById(INVALID_CATEGORY_ID);
        });
        assertEquals(Response.notFound("Category", INVALID_CATEGORY_ID), exception.getMessage());

        verify(categoryRepository, times(1)).findById(eq(Long.valueOf(INVALID_CATEGORY_ID)));
    }

    // Test POST Create Category
    @Test
    public void testCreateCategory_whenValidRequest_returnCreatedCategory() {
        // GIVEN
        when(categoryMapper.toEntity(validRequest)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toDTO(category)).thenReturn(validResponse);

        // WHEN
        CategoryResponseDTO result = categoryService.createCategory(validRequest);

        // THEN
        assertNotNull(result);
        assertEquals("Category 1", result.getName());

        verify(categoryRepository, times(1)).save(category);
        verify(categoryMapper, times(1)).toDTO(category);
    }

//    @Test
//    public void testCreateCategory_whenInvalidRequest_throwException() {
//        // GIVEN
//        CategoryRequestDTO invalidRequest = CategoryRequestDTO.builder().name("").enName("").build();
//        String errorMessage = "Category name is required";
//
//        // WHEN & THEN
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
//            categoryService.createCategory(invalidRequest);
//        });
//        assertEquals(errorMessage, exception.getMessage());
//
//        verify(categoryRepository, times(0)).save(any());
//        verify(categoryMapper, times(0)).toDTO(any());
//    }
//
//    // Test PUT Update Category
//    @Test
//    public void testUpdateCategory_whenValidRequest_returnUpdatedCategory() {
//        // GIVEN
//        CategoryRequestDTO updateRequest = CategoryRequestDTO.builder().name("Updated Category").enName("Updated English Name").build();
//        Category updatedCategory = Category.builder().id(CATEGORY_ID).name("Updated Category").enName("Updated English Name").build();
//        CategoryResponseDTO updatedResponse = CategoryResponseDTO.builder().id(CATEGORY_ID).name("Updated Category").enName("Updated English Name").build();
//
//        when(categoryRepository.findById(eq(CATEGORY_ID))).thenReturn(Optional.of(category));
//        when(categoryMapper.toEntity(updateRequest)).thenReturn(updatedCategory);
//        when(categoryRepository.save(updatedCategory)).thenReturn(updatedCategory);
//        when(categoryMapper.toDTO(updatedCategory)).thenReturn(updatedResponse);
//
//        // WHEN
//        CategoryResponseDTO result = categoryService.updateCategory(CATEGORY_ID.toString(), updateRequest);
//
//        // THEN
//        assertNotNull(result);
//        assertEquals("Updated Category", result.getName());
//        assertEquals("Updated English Name", result.getEnName());
//
//        verify(categoryRepository, times(1)).findById(eq(CATEGORY_ID));
//        verify(categoryMapper, times(1)).toEntity(updateRequest);
//        verify(categoryRepository, times(1)).save(updatedCategory);
//        verify(categoryMapper, times(1)).toDTO(updatedCategory);
//    }

    @Test
    public void testUpdateCategory_whenCategoryNotFound_throwException() {
        // GIVEN
        CategoryRequestDTO updateRequest = CategoryRequestDTO.builder().name("Updated Category").enName("Updated English Name").build();

        when(categoryRepository.findById(eq(CATEGORY_ID))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.updateCategory(CATEGORY_ID.toString(), updateRequest);
        });
        assertEquals(Response.notFound("Category", CATEGORY_ID.toString()), exception.getMessage());

        verify(categoryRepository, times(1)).findById(eq(CATEGORY_ID));
    }

    // Test DELETE Category
    @Test
    public void testDeleteCategory_whenSuccess_returnOk() {
        // GIVEN
        when(categoryRepository.findById(eq(CATEGORY_ID))).thenReturn(Optional.of(category));
        doNothing().when(categoryRepository).delete(category);

        // WHEN
        categoryService.deleteCategory(CATEGORY_ID.toString());

        // THEN
        verify(categoryRepository, times(1)).findById(eq(CATEGORY_ID));
        verify(categoryRepository, times(1)).delete(category);
    }

    @Test
    public void testDeleteCategory_whenCategoryNotFound_throwException() {
        // GIVEN
        when(categoryRepository.findById(eq(CATEGORY_ID))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.deleteCategory(CATEGORY_ID.toString());
        });
        assertEquals(Response.notFound("Category", CATEGORY_ID.toString()), exception.getMessage());

        verify(categoryRepository, times(1)).findById(eq(CATEGORY_ID));
        verify(categoryRepository, times(0)).delete(any());
    }
}
