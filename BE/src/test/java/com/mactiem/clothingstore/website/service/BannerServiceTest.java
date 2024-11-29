package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.BannerRequestDTO;
import com.mactiem.clothingstore.website.DTO.BannerResponseDTO;
import com.mactiem.clothingstore.website.entity.Banner;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.BannerMapper;
import com.mactiem.clothingstore.website.repository.BannerRepository;
import com.mactiem.clothingstore.website.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class BannerServiceTest {

    @Mock
    private BannerRepository bannerRepository;

    @Mock
    private BannerMapper bannerMapper;

    @Mock
    private UserService userService;

    @InjectMocks
    private BannerService bannerService;

    private BannerRequestDTO validRequest;
    private BannerResponseDTO validResponse;
    private Banner banner;
    private User user;

    private static final Long BANNER_ID = 1L;
    private static final String INVALID_BANNER_ID = "999";

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Initialize BannerRequestDTO (Valid Request)
        validRequest = BannerRequestDTO.builder()
                .path("path/to/banner/image.jpg")
                .build();

        // Initialize Banner entity
        user = new User();
        user.setId(1L);
        banner = Banner.builder()
                .id(BANNER_ID)
                .path("path/to/banner/image.jpg")
                .user(user)
                .build();

        // Initialize BannerResponseDTO
        validResponse = BannerResponseDTO.builder()
                .id(BANNER_ID)
                .path("path/to/banner/image.jpg")
                .user(null)
                .build();
    }

    //* Test GET All Banners
    @Test
    public void testGetAllBanners_whenBannersExist_returnBannerList() {
        // GIVEN
        List<Banner> banners = List.of(banner);
        List<BannerResponseDTO> responseList = List.of(validResponse);

        when(bannerRepository.findAll()).thenReturn(banners);
        when(bannerMapper.toListDTOs(banners)).thenReturn(responseList);

        // WHEN
        List<BannerResponseDTO> result = bannerService.getAll();

        // THEN
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("path/to/banner/image.jpg", result.get(0).getPath());

        verify(bannerRepository, times(1)).findAll();
        verify(bannerMapper, times(1)).toListDTOs(banners);
    }

    @Test
    public void testGetAllBanners_whenNoBannersExist_returnEmptyList() {
        // GIVEN
        List<Banner> banners = Collections.emptyList();
        List<BannerResponseDTO> responseList = Collections.emptyList();

        when(bannerRepository.findAll()).thenReturn(banners);
        when(bannerMapper.toListDTOs(banners)).thenReturn(responseList);

        // WHEN
        List<BannerResponseDTO> result = bannerService.getAll();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(bannerRepository, times(1)).findAll();
        verify(bannerMapper, times(1)).toListDTOs(banners);
    }

    //* Test GET Banner by ID
    @Test
    public void testGetBannerById_whenBannerExists_returnBannerResponseDTO() {
        // GIVEN
        when(bannerRepository.findById(eq(BANNER_ID))).thenReturn(Optional.of(banner));
        when(bannerMapper.toDTO(banner)).thenReturn(validResponse);

        // WHEN
        BannerResponseDTO result = bannerService.getById(BANNER_ID.toString());

        // THEN
        assertNotNull(result);
        assertEquals("path/to/banner/image.jpg", result.getPath());

        verify(bannerRepository, times(1)).findById(eq(BANNER_ID));
        verify(bannerMapper, times(1)).toDTO(banner);
    }

    @Test
    public void testGetBannerById_whenBannerDoesNotExist_throwException() {
        // GIVEN
        when(bannerRepository.findById(eq(Long.valueOf(INVALID_BANNER_ID)))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bannerService.getById(INVALID_BANNER_ID);
        });
        assertEquals(Response.notFound("Banner", INVALID_BANNER_ID), exception.getMessage());

        verify(bannerRepository, times(1)).findById(eq(Long.valueOf(INVALID_BANNER_ID)));
    }

    //* Test POST Create Banner
    @Test
    public void testCreateBanner_whenValidRequest_returnCreatedBanner() {
        // GIVEN
        when(userService.findUserById(any())).thenReturn(user);
        when(bannerMapper.toEntity(validRequest)).thenReturn(banner);
        when(bannerRepository.save(banner)).thenReturn(banner);
        when(bannerMapper.toDTO(banner)).thenReturn(validResponse);

        // WHEN
        BannerResponseDTO result = bannerService.create(validRequest);

        // THEN
        assertNotNull(result);
        assertEquals("path/to/banner/image.jpg", result.getPath());

        verify(bannerRepository, times(1)).save(banner);
        verify(bannerMapper, times(1)).toDTO(banner);
    }

    @Test
    public void testCreateBanner_whenInvalidRequest_throwException() {
        // GIVEN
        BannerRequestDTO invalidRequest = BannerRequestDTO.builder().path("").build();
        String errorMessage = "Banner's 'path' is required";

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            bannerService.create(invalidRequest);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(errorMessage, exception.getReason());

        verify(bannerRepository, times(0)).save(any());
        verify(bannerMapper, times(0)).toDTO(any());
    }

    //* Test PUT Update Banner
//    @Test
//    public void testUpdateBanner_whenValidRequest_returnUpdatedBanner() {
//        // GIVEN
//        BannerRequestDTO updateRequest = BannerRequestDTO.builder().path("path/to/updated/banner.jpg").build();
//        Banner updatedBanner = Banner.builder().id(BANNER_ID).path("path/to/updated/banner.jpg").build();
//        BannerResponseDTO updatedResponse = BannerResponseDTO.builder().id(BANNER_ID).path("path/to/updated/banner.jpg").build();
//
//        // Mock the behavior of the repository and mapper
//        when(bannerRepository.findById(eq(BANNER_ID))).thenReturn(Optional.of(banner));
//        when(bannerMapper.toEntity(updateRequest)).thenReturn(updatedBanner);
//        when(bannerRepository.save(updatedBanner)).thenReturn(updatedBanner);
//        when(bannerMapper.toDTO(updatedBanner)).thenReturn(updatedResponse);
//
//        // WHEN
//        BannerResponseDTO result = bannerService.update(BANNER_ID.toString(), updateRequest);
//
//        // THEN
//        assertNotNull(result);  // Ensure result is not null
//        assertEquals("path/to/updated/banner.jpg", result.getPath());  // Check the path is updated
//
//        // Verify interactions with mocks
//        verify(bannerRepository, times(1)).findById(eq(BANNER_ID));
//        verify(bannerMapper, times(1)).toEntity(updateRequest);
//        verify(bannerRepository, times(1)).save(updatedBanner);
//        verify(bannerMapper, times(1)).toDTO(updatedBanner);
//    }

    @Test
    public void testUpdateBanner_whenBannerNotFound_throwException() {
        // GIVEN
        BannerRequestDTO updateRequest = BannerRequestDTO.builder().path("new/path/to/banner.jpg").build();

        when(bannerRepository.findById(eq(BANNER_ID))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bannerService.update(BANNER_ID.toString(), updateRequest);
        });
        assertEquals(Response.notFound("Banner", BANNER_ID.toString()), exception.getMessage());

        verify(bannerRepository, times(1)).findById(eq(BANNER_ID));
    }

    //* Test DELETE Banner
    @Test
    public void testDeleteBanner_whenSuccess_returnOk() {
        // GIVEN
        when(bannerRepository.findById(eq(BANNER_ID))).thenReturn(Optional.of(banner));
        doNothing().when(bannerRepository).delete(banner);

        // WHEN
        bannerService.delete(BANNER_ID.toString());

        // THEN
        verify(bannerRepository, times(1)).findById(eq(BANNER_ID));
        verify(bannerRepository, times(1)).delete(banner);
    }

    @Test
    public void testDeleteBanner_whenBannerNotFound_throwException() {
        // GIVEN
        when(bannerRepository.findById(eq(BANNER_ID))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bannerService.delete(BANNER_ID.toString());
        });
        assertEquals(Response.notFound("Banner", BANNER_ID.toString()), exception.getMessage());

        verify(bannerRepository, times(1)).findById(eq(BANNER_ID));
        verify(bannerRepository, times(0)).delete(any());
    }
}
