package com.mactiem.clothingstore.website.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.CategoryRequestDTO;
import com.mactiem.clothingstore.website.DTO.CategoryResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    private CategoryRequestDTO validCategoryRequest;
    private CategoryResponseDTO validCategoryResponse;
    private static final long CATEGORY_ID = 1L;
    private static final long INVALID_CATEGORY_ID = 999L;

    @BeforeEach
    public void setup() {
        validCategoryRequest = new CategoryRequestDTO("Category 1", "Category 1 Description");
        List<ProductResponseDTO> emptyProductsList = List.of(); // An empty list of products

        validCategoryResponse = new CategoryResponseDTO(1L, "Category 1", "Category 1 Description", emptyProductsList);

        // Initialize the Category Service mock data
        Mockito.when(categoryService.getAllCategories()).thenReturn(List.of(validCategoryResponse));
        Mockito.when(categoryService.getCategoryById(eq(CATEGORY_ID+""))).thenReturn(validCategoryResponse);
    }

    //* Test GET all categories
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetAllCategories_whenCategoriesExist_returnCategoryList() throws Exception {
        // WHEN & THEN
        mockMvc.perform(get("/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)) // Expect one category
                .andExpect(jsonPath("$[0].name").value("Category 1"));

        Mockito.verify(categoryService, Mockito.times(1)).getAllCategories();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetAllCategories_whenEmptyList_returnEmptyArray() throws Exception {
        // GIVEN
        Mockito.when(categoryService.getAllCategories()).thenReturn(List.of()); // Empty list of categories

        // WHEN & THEN
        mockMvc.perform(get("/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0)); // Expect an empty list

        Mockito.verify(categoryService, Mockito.times(1)).getAllCategories();
    }

    //* Test GET Category by ID
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetCategoryById_whenCategoryExists_returnCategoryResponseDTO() throws Exception {
        // WHEN & THEN
        mockMvc.perform(get("/categories/{id}", CATEGORY_ID+"")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Category 1"));

        Mockito.verify(categoryService, Mockito.times(1)).getCategoryById(eq(CATEGORY_ID+""));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetCategoryById_whenCategoryNotFound_returnNotFound() throws Exception {
        // GIVEN
        Mockito.when(categoryService.getCategoryById(eq(INVALID_CATEGORY_ID+"")))
                .thenThrow(new RuntimeException("Category not found"));

        // WHEN & THEN
        mockMvc.perform(get("/categories/{id}", INVALID_CATEGORY_ID+"")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found"));

        Mockito.verify(categoryService, Mockito.times(1)).getCategoryById(eq(INVALID_CATEGORY_ID+""));
    }

    //* Test POST Create Category
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateCategory_whenValidRequest_returnCreatedCategory() throws Exception {
        // GIVEN
        Mockito.when(categoryService.createCategory(any(CategoryRequestDTO.class))).thenReturn(validCategoryResponse);

        // WHEN & THEN
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validCategoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Category 1"));

        Mockito.verify(categoryService, Mockito.times(1)).createCategory(any(CategoryRequestDTO.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateCategory_whenInvalidRequest_returnBadRequest() throws Exception {
        // GIVEN
        CategoryRequestDTO invalidRequest = new CategoryRequestDTO("", ""); // Invalid data (empty name and description)

        String errorMessage = "Category name is required";
        Mockito.when(categoryService.createCategory(any(CategoryRequestDTO.class)))
                .thenThrow(new RuntimeException(errorMessage));

        // WHEN & THEN
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(errorMessage));

        Mockito.verify(categoryService, Mockito.times(1)).createCategory(any(CategoryRequestDTO.class));
    }

    //* Test PUT Update Category
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateCategory_whenValidRequest_returnUpdatedCategory() throws Exception {
        // GIVEN
        CategoryRequestDTO updateRequest = new CategoryRequestDTO("Updated Category", "Updated Category Description");

        List<ProductResponseDTO> emptyProductsList = List.of(); // An empty list of products

        CategoryResponseDTO updatedResponse  = new CategoryResponseDTO(1L, "Category 1", "Category 1 Description", emptyProductsList);


        Mockito.when(categoryService.updateCategory(eq(CATEGORY_ID+""), any(CategoryRequestDTO.class)))
                .thenReturn(updatedResponse);

        // WHEN & THEN
        mockMvc.perform(put("/categories/{id}", CATEGORY_ID+"")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Category 1"));

        Mockito.verify(categoryService, Mockito.times(1)).updateCategory(eq(CATEGORY_ID+""), any(CategoryRequestDTO.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateCategory_whenCategoryNotFound_returnNotFound() throws Exception {
        // GIVEN
        CategoryRequestDTO updateRequest = new CategoryRequestDTO("Updated Category", "Updated Category Description");

        Mockito.when(categoryService.updateCategory(eq(INVALID_CATEGORY_ID+""), any(CategoryRequestDTO.class)))
                .thenThrow(new RuntimeException("Category not found"));

        // WHEN & THEN
        mockMvc.perform(put("/categories/{id}", INVALID_CATEGORY_ID+"")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Category not found"));

        Mockito.verify(categoryService, Mockito.times(1)).updateCategory(eq(INVALID_CATEGORY_ID+""), any(CategoryRequestDTO.class));
    }

    //* Test DELETE Category
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteCategory_whenSuccess_returnOk() throws Exception {
        // GIVEN
        Mockito.doNothing().when(categoryService).deleteCategory(eq(CATEGORY_ID+""));

        // WHEN & THEN
        mockMvc.perform(delete("/categories/{id}", CATEGORY_ID+""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
                .andExpect(jsonPath("$.message").value("Deleted Category Successfully"));

        Mockito.verify(categoryService, Mockito.times(1)).deleteCategory(eq(CATEGORY_ID+""));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteCategory_whenCategoryNotFound_returnNotFound() throws Exception {
        // GIVEN
        Mockito.doThrow(new RuntimeException("Category not found"))
                .when(categoryService).deleteCategory(eq(INVALID_CATEGORY_ID+""));

        // WHEN & THEN
        mockMvc.perform(delete("/categories/{id}", INVALID_CATEGORY_ID+""))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found"));

        Mockito.verify(categoryService, Mockito.times(1)).deleteCategory(eq(INVALID_CATEGORY_ID+""));
    }
}
