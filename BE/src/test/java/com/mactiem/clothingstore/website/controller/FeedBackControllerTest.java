//package com.mactiem.clothingstore.website.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
//import com.mactiem.clothingstore.website.DTO.FeedBackResponseDTO;
//import com.mactiem.clothingstore.website.entity.FeedBack;
//import com.mactiem.clothingstore.website.entity.GenerateID;
//import com.mactiem.clothingstore.website.entity.Response;
//import com.mactiem.clothingstore.website.service.FeedBackService;
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
//import org.springframework.web.server.ResponseStatusException;
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
//public class FeedBackControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private FeedBackService feedBackService;
//
//    private FeedBackRequestDTO validRequest;
//    private FeedBackResponseDTO validResponse;
//    private FeedBack feedBack;
//    private List<FeedBack> feedBackList;
//    private List<FeedBackResponseDTO> responseList;
//    private final String FEEDBACK_ID = GenerateID.generateID();
//
//    @BeforeEach
//    public void setup() {
//        // Initialize FeedBackRequestDTO (Valid Request)
//        validRequest = FeedBackRequestDTO.builder()
//                .point(4.5)
//                .description("Great product!")
//                .user("user-id-123")
//                .product("product-id-456")
//                .build();
//
//        // Initialize FeedBack entity
//        feedBack = FeedBack.builder()
//                .id(FEEDBACK_ID)
//                .user(new com.mactiem.clothingstore.website.entity.User()) // Assuming a User entity exists
//                .product(new com.mactiem.clothingstore.website.entity.Product()) // Assuming a Product entity exists
//                .createDate(LocalDate.now())
//                .updateDate(LocalDate.now())
//                .point(4.5)
//                .description("Great product!")
//                .build();
//
//        // Initialize FeedBackResponseDTO
//        validResponse = FeedBackResponseDTO.builder()
//                .id(FEEDBACK_ID)
//                .createDate(LocalDate.now())
//                .updateDate(LocalDate.now())
//                .point(4.5)
//                .description("Great product!")
//                .user("user-id-123")
//                .build();
//
//        // Initialize list of FeedBacks
//        feedBackList = Collections.singletonList(feedBack);
//
//        // Initialize list of FeedBackResponseDTOs
//        responseList = Collections.singletonList(validResponse);
//    }
//
//    // --- CREATE FEEDBACK ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateFeedBack_whenValidRequest_returnFeedBackResponse() throws Exception {
//        // Given
//        Mockito.when(feedBackService.createFeedBack(eq(validRequest))).thenReturn(validResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/feedbacks")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(validResponse.getId()))
//                .andExpect(jsonPath("$.createDate").value(validResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$.updateDate").value(validResponse.getUpdateDate().toString()))
//                .andExpect(jsonPath("$.point").value(validResponse.getPoint()))
//                .andExpect(jsonPath("$.description").value(validResponse.getDescription()))
//                .andExpect(jsonPath("$.user").value(validResponse.getUser()));
//        // Add more assertions if needed for nested objects
//
//        Mockito.verify(feedBackService, Mockito.times(1)).createFeedBack(eq(validRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testCreateFeedBack_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        FeedBackRequestDTO badRequest = FeedBackRequestDTO.builder()
//                .point(-1.0) // Invalid point
//                .description("") // Invalid description
//                .user("") // Invalid user
//                .product("") // Invalid product
//                .build();
//        String errorMessage = "Invalid feedback data";
//        Mockito.when(feedBackService.createFeedBack(eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .post("/feedbacks")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(feedBackService, Mockito.times(1)).createFeedBack(eq(badRequest));
//    }
//
//    // --- UPDATE FEEDBACK ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateFeedBack_whenValidRequest_returnUpdatedFeedBack() throws Exception {
//        // Given
//        FeedBackRequestDTO updateRequest = FeedBackRequestDTO.builder()
//                .point(5.0)
//                .description("Excellent product!")
//                .user("user-id-123") // Assuming user and product IDs remain the same
//                .product("product-id-456")
//                .build();
//
//        FeedBackResponseDTO updatedResponse = FeedBackResponseDTO.builder()
//                .id(FEEDBACK_ID)
//                .createDate(feedBack.getCreateDate())
//                .updateDate(LocalDate.now())
//                .point(5.0)
//                .description("Excellent product!")
//                .user("user-id-123")
//                .build();
//
//        Mockito.when(feedBackService.updateFeedBack(eq(FEEDBACK_ID), eq(updateRequest)))
//                .thenReturn(updatedResponse);
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/feedbacks/{id}", FEEDBACK_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(updatedResponse.getId()))
//                .andExpect(jsonPath("$.createDate").value(updatedResponse.getCreateDate().toString()))
//                .andExpect(jsonPath("$.updateDate").value(updatedResponse.getUpdateDate().toString()))
//                .andExpect(jsonPath("$.point").value(updatedResponse.getPoint()))
//                .andExpect(jsonPath("$.description").value(updatedResponse.getDescription()))
//                .andExpect(jsonPath("$.user").value(updatedResponse.getUser()));
//        // Add more assertions if needed for nested objects
//
//        Mockito.verify(feedBackService, Mockito.times(1)).updateFeedBack(eq(FEEDBACK_ID), eq(updateRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateFeedBack_whenInvalidRequest_returnBadRequest() throws Exception {
//        // Given
//        FeedBackRequestDTO badRequest = FeedBackRequestDTO.builder()
//                .point(-5.0) // Invalid point
//                .description("") // Invalid description
//                .user("") // Invalid user
//                .product("") // Invalid product
//                .build();
//        String errorMessage = "Invalid update data";
//        Mockito.when(feedBackService.updateFeedBack(eq(FEEDBACK_ID), eq(badRequest)))
//                .thenThrow(new RuntimeException(errorMessage));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/feedbacks/{id}", FEEDBACK_ID)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(badRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(feedBackService, Mockito.times(1)).updateFeedBack(eq(FEEDBACK_ID), eq(badRequest));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testUpdateFeedBack_whenFeedBackNotFound_returnBadRequest() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        FeedBackRequestDTO updateRequest = FeedBackRequestDTO.builder()
//                .point(5.0)
//                .description("Excellent product!")
//                .user("user-id-123")
//                .product("product-id-456")
//                .build();
//        String errorMessage = "Feedback not found with id: " + nonExistentId;
//
//        // Mock the service to throw a 400 Bad Request exception
//        Mockito.when(feedBackService.updateFeedBack(eq(nonExistentId), eq(updateRequest)))
//                .thenThrow(new RuntimeException(Response.notFound("FeedBack", nonExistentId)));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .put("/feedbacks/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateRequest)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
//                .andExpect(jsonPath("$.message").value(Response.notFound("FeedBack", nonExistentId)));
//
//        // Verify that the service was called once with the correct parameters
//        Mockito.verify(feedBackService, Mockito.times(1)).updateFeedBack(eq(nonExistentId), eq(updateRequest));
//    }
//
//
//    // --- DELETE FEEDBACK ----------------------------------------------------------------------------------------
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteFeedBack_whenValidId_returnOk() throws Exception {
//        // Given
//        Mockito.doNothing().when(feedBackService).delete(eq(FEEDBACK_ID));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/feedbacks/{id}", FEEDBACK_ID)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
//                .andExpect(jsonPath("$.message").value("Deleted FeedBack Successfully"));
//
//        Mockito.verify(feedBackService, Mockito.times(1)).delete(eq(FEEDBACK_ID));
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void testDeleteFeedBack_whenFeedBackNotFound_returnNotFound() throws Exception {
//        // Given
//        String nonExistentId = "non-existent-id";
//        String errorMessage = "Feedback not found with id: " + nonExistentId;
//        Mockito.doThrow(new RuntimeException(errorMessage))
//                .when(feedBackService).delete(eq(nonExistentId));
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders
//                        .delete("/feedbacks/{id}", nonExistentId)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
//                .andExpect(jsonPath("$.message").value(errorMessage));
//
//        Mockito.verify(feedBackService, Mockito.times(1)).delete(eq(nonExistentId));
//    }
//}
