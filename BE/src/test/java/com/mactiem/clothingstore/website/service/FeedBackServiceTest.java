package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.FeedBackResponseDTO;
import com.mactiem.clothingstore.website.entity.FeedBack;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.FeedBackMapper;
import com.mactiem.clothingstore.website.repository.FeedBackRepository;
import com.mactiem.clothingstore.website.validator.FeedBackValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Test class for FeedBackService.
 */
@SpringBootTest
public class FeedBackServiceTest {

    @Autowired
    private FeedBackService feedBackService;

    @MockBean
    private FeedBackRepository feedBackRepository;

    @MockBean
    private FeedBackMapper feedBackMapper;

    @MockBean
    private FeedBackValidator feedBackValidator;

    @MockBean
    private ProductService productService;

    private FeedBackRequestDTO validRequest;
    private FeedBackResponseDTO validResponse;
    private FeedBack feedBack;
    private List<FeedBack> feedBackList;
    private List<FeedBackResponseDTO> responseList;
    private final long FEEDBACK_ID = 1;

    /**
     * Setup common test data before each test.
     */
    @BeforeEach
    public void setup() {
        // Initialize FeedBackRequestDTO (Valid Request)
        validRequest = FeedBackRequestDTO.builder()
                .point(4.5)
                .description("Great product!")
                .user("1")
                .product("2")
                .build();

        // Initialize FeedBack entity
        feedBack = FeedBack.builder()
                .id(FEEDBACK_ID)
                .user(new com.mactiem.clothingstore.website.entity.User()) // Assuming a User entity exists
                .product(new com.mactiem.clothingstore.website.entity.Product()) // Assuming a Product entity exists
                .createDate(LocalDate.now())
                .updateDate(LocalDate.now())
                .point(4.5)
                .description("Great product!")
                .build();

        // Initialize FeedBackResponseDTO
        validResponse = FeedBackResponseDTO.builder()
                .id(FEEDBACK_ID)
                .createDate(LocalDate.now())
                .updateDate(LocalDate.now())
                .point(4.5)
                .description("Great product!")
                .user(1L)
                .build();

        // Initialize list of FeedBacks
        feedBackList = Collections.singletonList(feedBack);

        // Initialize list of FeedBackResponseDTOs
        responseList = Collections.singletonList(validResponse);
    }
    // --- Create Feedback ---

    /**
     * Test creating a feedback with a valid request.
     */
    @Test
    public void testCreateFeedBack_whenValidRequest_thenFeedBackIsCreated() {
        // GIVEN
        Mockito.doNothing().when(feedBackValidator).validateFeedBackRequest(eq(validRequest));
        when(feedBackMapper.toEntity(validRequest)).thenReturn(feedBack);
        when(productService.findProductById(validRequest.getProduct())).thenReturn(feedBack.getProduct());
        when(feedBackRepository.save(feedBack)).thenReturn(feedBack);
        when(feedBackMapper.toDTO(feedBack)).thenReturn(validResponse);

        // WHEN
        FeedBackResponseDTO result = feedBackService.createFeedBack(validRequest);

        // THEN
        assertNotNull(result, "The result should not be null");
        assertEquals("Great product!", result.getDescription(), "Feedback description should match");
        assertEquals(4.5, result.getPoint(), "Feedback point should match");

        verify(feedBackValidator, times(1)).validateFeedBackRequest(validRequest);
        verify(feedBackMapper, times(1)).toEntity(validRequest);
        verify(productService, times(1)).findProductById(validRequest.getProduct());
        verify(feedBackRepository, times(1)).save(feedBack);
        verify(feedBackMapper, times(1)).toDTO(feedBack);
    }

    /**
     * Test creating a feedback with an invalid request.
     */
    @Test
    public void testCreateFeedBack_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Invalid feedback data";
        Mockito.doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(feedBackValidator).validateFeedBackRequest(any(FeedBackRequestDTO.class));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> feedBackService.createFeedBack(validRequest),
                "Expected to throw ResponseStatusException when request is invalid"
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode(), "Exception status should be BAD_REQUEST");
        assertEquals(errorMessage, exception.getReason(), "Exception reason should match");

        verify(feedBackValidator, times(1)).validateFeedBackRequest(validRequest);
        verify(feedBackMapper, times(0)).toEntity(any());
        verify(productService, times(0)).findProductById(any());
        verify(feedBackRepository, times(0)).save(any());
        verify(feedBackMapper, times(0)).toDTO(any());
    }

    // --- Update Feedback ---

    /**
     * Test updating a feedback with a valid request when the feedback exists.
     */
    @Test
    public void testUpdateFeedBack_whenValidRequest_thenFeedBackIsUpdated() throws NoSuchFieldException, IllegalAccessException {
        // GIVEN
        when(feedBackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(feedBack));
        Mockito.doNothing().when(feedBackValidator).validateUpdate(eq(validRequest));

        // Simulate the update by creating an updated FeedBack entity
        FeedBack updatedFeedBack = FeedBack.builder()
                .id(FEEDBACK_ID)
                .user(feedBack.getUser())
                .product(feedBack.getProduct())
                .createDate(feedBack.getCreateDate())
                .updateDate(LocalDate.now())
                .point(5.0)
                .description("Excellent product!")
                .build();

        when(feedBackRepository.save(any(FeedBack.class))).thenReturn(updatedFeedBack);
        when(feedBackMapper.toDTO(updatedFeedBack)).thenReturn(
                FeedBackResponseDTO.builder()
                        .id(FEEDBACK_ID)
                        .createDate(feedBack.getCreateDate())
                        .updateDate(updatedFeedBack.getUpdateDate())
                        .point(5.0)
                        .description("Excellent product!")
                        .user(1L)
                        .build()
        );

        // WHEN
        FeedBackResponseDTO result = feedBackService.updateFeedBack(FEEDBACK_ID+"", validRequest);

        // THEN
        assertNotNull(result, "The result should not be null");
        assertEquals("Excellent product!", result.getDescription(), "Feedback description should be updated");
        assertEquals(5.0, result.getPoint(), "Feedback point should be updated");

        verify(feedBackRepository, times(1)).findById(FEEDBACK_ID);
        verify(feedBackValidator, times(1)).validateUpdate(validRequest);
        verify(feedBackRepository, times(1)).save(feedBack);
        verify(feedBackMapper, times(1)).toDTO(updatedFeedBack);
    }

    /**
     * Test updating a feedback when the feedback does not exist.
     */
    @Test
    public void testUpdateFeedBack_whenFeedBackDoesNotExist_throwException() {
        // GIVEN
        long nonExistentId = 999L;
        when(feedBackRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> feedBackService.updateFeedBack(nonExistentId+"", validRequest),
                "Expected to throw RuntimeException when feedback does not exist"
        );
        assertEquals(Response.notFound("FeedBack", nonExistentId+""), exception.getMessage(), "Exception message should match");

        verify(feedBackRepository, times(1)).findById(nonExistentId);
        verify(feedBackValidator, times(0)).validateUpdate(any());
        verify(feedBackRepository, times(0)).save(any());
        verify(feedBackMapper, times(0)).toDTO(any());
    }

    /**
     * Test updating a feedback with an invalid request.
     */
    @Test
    public void testUpdateFeedBack_whenInvalidRequest_throwException() {
        // GIVEN
        String errorMessage = "Invalid update data";
        Mockito.doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage))
                .when(feedBackValidator).validateUpdate(any(FeedBackRequestDTO.class));

        // Mock findById to return the existing feedback
        when(feedBackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(feedBack));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> feedBackService.updateFeedBack(FEEDBACK_ID+"", validRequest),
                "Expected to throw ResponseStatusException when update request is invalid"
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode(), "Exception status should be BAD_REQUEST");
        assertEquals(errorMessage, exception.getReason(), "Exception reason should match");

        verify(feedBackRepository, times(1)).findById(FEEDBACK_ID);
        verify(feedBackValidator, times(1)).validateUpdate(validRequest);
        verify(feedBackRepository, times(0)).save(any());
        verify(feedBackMapper, times(0)).toDTO(any());
    }

    // --- Delete Feedback ---

    /**
     * Test deleting a feedback when it exists.
     */
    @Test
    public void testDeleteFeedBack_whenFeedBackExists_thenFeedBackIsDeleted() {
        // GIVEN
        when(feedBackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(feedBack));
        doNothing().when(feedBackRepository).delete(feedBack);

        // WHEN
        feedBackService.delete(FEEDBACK_ID+"");

        // THEN
        verify(feedBackRepository, times(1)).findById(FEEDBACK_ID);
        verify(feedBackRepository, times(1)).delete(feedBack);
    }

    /**
     * Test deleting a feedback when it does not exist.
     */
    @Test
    public void testDeleteFeedBack_whenFeedBackDoesNotExist_throwException() {
        // GIVEN
        long nonExistentId = 99L;
        when(feedBackRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> feedBackService.delete(nonExistentId+""),
                "Expected to throw RuntimeException when feedback does not exist"
        );
        assertEquals(Response.notFound("FeedBack", nonExistentId+""), exception.getMessage(), "Exception message should match");

        verify(feedBackRepository, times(1)).findById(nonExistentId);
        verify(feedBackRepository, times(0)).delete(any());
    }
}
