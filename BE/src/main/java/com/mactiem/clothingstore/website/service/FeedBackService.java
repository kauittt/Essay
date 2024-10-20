package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.*;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.FeedBackMapper;
import com.mactiem.clothingstore.website.repository.FeedBackRepository;
import com.mactiem.clothingstore.website.validator.FeedBackValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;

@Service
public class FeedBackService {
    private final FeedBackRepository feedBackRepository;
    private final FeedBackMapper feedBackMapper;
    private final FeedBackValidator feedBackValidator;
    private final ProductService productService;

    @Autowired
    public FeedBackService(FeedBackMapper feedBackMapper, FeedBackRepository feedBackRepository, FeedBackValidator feedBackValidator, ProductService productService) {
        this.feedBackMapper = feedBackMapper;
        this.feedBackRepository = feedBackRepository;
        this.feedBackValidator = feedBackValidator;
        this.productService = productService;
    }

    //- Helper
    public FeedBack findFeedBackById(String id) {
        return feedBackRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("FeedBack", id)));
    }


    //- Methods
    @Transactional
    public FeedBackResponseDTO createFeedBack(FeedBackRequestDTO feedBackRequestDTO) {
        feedBackValidator.validateFeedBackRequest(feedBackRequestDTO);

        //- Mapping
        FeedBack feedBack = feedBackMapper.toEntity(feedBackRequestDTO);
        feedBack.setCreateDate(LocalDate.now());
        feedBack.setUpdateDate(LocalDate.now());
        feedBack.setProduct(productService.findProductById(feedBackRequestDTO.getProduct())); //- Ra ngoài cho khỏi bị loop denpendency

        return feedBackMapper.toDTO(feedBackRepository.save(feedBack));
    }


    @Transactional
    public FeedBackResponseDTO updateFeedBack(String id, FeedBackRequestDTO feedBackRequestDTO) {
        FeedBack feedBack = findFeedBackById(id);

        feedBackValidator.validateUpdate(feedBackRequestDTO);

        Field[] fields = feedBackRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("user") && !field.getName().equals("product")) {
                    Object value = field.get(feedBackRequestDTO);
                    if (value != null) {
                        Field dbField = FeedBack.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(feedBack, value);
                    }
                }
            }

        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        feedBack.setUpdateDate(LocalDate.now());

        return feedBackMapper.toDTO(feedBackRepository.save(feedBack));
    }

    @Transactional
    public void delete(String id) {
        FeedBack feedBack = findFeedBackById(id);
        feedBackRepository.delete(feedBack);
    }
}
