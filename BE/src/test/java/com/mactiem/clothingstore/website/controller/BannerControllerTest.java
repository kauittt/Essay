package com.mactiem.clothingstore.website.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.BannerRequestDTO;
import com.mactiem.clothingstore.website.DTO.BannerResponseDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.service.BannerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
public class BannerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BannerService bannerService;

    private BannerRequestDTO validBannerRequest;
    private BannerResponseDTO validBannerResponse;

    private static final String BANNER_ID = "1";
    private static final String INVALID_BANNER_ID = "non-existent-id";

    @BeforeEach
    public void setup() {
        validBannerRequest = BannerRequestDTO.builder()
                .path("path/to/banner/image.jpg")
                .build();

        validBannerResponse = BannerResponseDTO.builder()
                .id(1L)
                .path("path/to/banner/image.jpg")
                .user(null) // Assuming a user is included in the DTO, can mock it if needed
                .build();
    }

    //* Test GET all banners
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetAllBanners_whenSuccess_returnBannerList() throws Exception {
        // GIVEN
        List<BannerResponseDTO> banners = List.of(validBannerResponse);
        Mockito.when(bannerService.getAll()).thenReturn(banners);

        // WHEN & THEN
        mockMvc.perform(get("/banners")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].path").value("path/to/banner/image.jpg"));

        Mockito.verify(bannerService, Mockito.times(1)).getAll();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetAllBanners_whenEmptyList_returnEmptyArray() throws Exception {
        // GIVEN
        List<BannerResponseDTO> emptyBanners = List.of();
        Mockito.when(bannerService.getAll()).thenReturn(emptyBanners);

        // WHEN & THEN
        mockMvc.perform(get("/banners")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        Mockito.verify(bannerService, Mockito.times(1)).getAll();
    }

    //* Test POST create banner
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateBanner_whenValidRequest_returnCreatedBanner() throws Exception {
        // GIVEN
        Mockito.when(bannerService.create(any(BannerRequestDTO.class))).thenReturn(validBannerResponse);

        // WHEN & THEN
        mockMvc.perform(post("/banners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBannerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.path").value("path/to/banner/image.jpg"));

        Mockito.verify(bannerService, Mockito.times(1)).create(any(BannerRequestDTO.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateBanner_whenInvalidRequest_returnBadRequest() throws Exception {
        // GIVEN
        BannerRequestDTO invalidRequest = BannerRequestDTO.builder().path("").build();

        String errorMessage = "Banner's 'path' is required";
        Mockito.when(bannerService.create(any(BannerRequestDTO.class)))
                .thenThrow(new RuntimeException(errorMessage));

        // WHEN & THEN
        mockMvc.perform(post("/banners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(errorMessage));

        Mockito.verify(bannerService, Mockito.times(1)).create(any(BannerRequestDTO.class));
    }

    //* Test PUT update banner
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateBanner_whenValidRequest_returnUpdatedBanner() throws Exception {
        // GIVEN
        Mockito.when(bannerService.update(eq(BANNER_ID), any(BannerRequestDTO.class))).thenReturn(validBannerResponse);

        // WHEN & THEN
        mockMvc.perform(put("/banners/{id}", BANNER_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBannerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.path").value("path/to/banner/image.jpg"));

        Mockito.verify(bannerService, Mockito.times(1)).update(eq(BANNER_ID), any(BannerRequestDTO.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateBanner_whenBannerNotFound_returnNotFound() throws Exception {
        // GIVEN
        BannerRequestDTO invalidRequest = BannerRequestDTO.builder().path("new/path/to/banner.jpg").build();

        // Simulate a scenario where the banner with ID "non-existent-id" does not exist
        Mockito.when(bannerService.update(eq(INVALID_BANNER_ID), any(BannerRequestDTO.class)))
                .thenThrow(new RuntimeException("Banner not found"));

        // WHEN & THEN
        mockMvc.perform(put("/banners/{id}", INVALID_BANNER_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Banner not found"));

        Mockito.verify(bannerService, Mockito.times(1)).update(eq(INVALID_BANNER_ID), any(BannerRequestDTO.class));
    }

    //* Test DELETE delete banner
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteBanner_whenSuccess_returnOk() throws Exception {
        // GIVEN
        Mockito.doNothing().when(bannerService).delete(eq(BANNER_ID));

        // WHEN & THEN
        mockMvc.perform(delete("/banners/{id}", BANNER_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()));

        Mockito.verify(bannerService, Mockito.times(1)).delete(eq(BANNER_ID));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteBanner_whenBannerNotFound_returnNotFound() throws Exception {
        // GIVEN
        // Simulate a scenario where the banner with ID "non-existent-id" does not exist
        Mockito.doThrow(new RuntimeException("Banner not found"))
                .when(bannerService).delete(eq(INVALID_BANNER_ID));

        // WHEN & THEN
        mockMvc.perform(delete("/banners/{id}", INVALID_BANNER_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Banner not found"));

        Mockito.verify(bannerService, Mockito.times(1)).delete(eq(INVALID_BANNER_ID));
    }

}
