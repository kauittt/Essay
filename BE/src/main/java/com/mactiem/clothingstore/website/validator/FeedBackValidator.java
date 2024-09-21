package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class FeedBackValidator {
    private final UserService userService;
    private final ProductService productService;

    @Autowired
    public FeedBackValidator(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    public void validatePoint(FeedBackRequestDTO feedBackRequestDTO) {
        if (feedBackRequestDTO.getPoint() != null) {
            if (feedBackRequestDTO.getPoint() < 1.0 || feedBackRequestDTO.getPoint() > 5.0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Point must be between 1.0 and 5.0");
            }
        }
    }

    public void validateFeedBackRequest(FeedBackRequestDTO feedBackRequestDTO) {
        if (feedBackRequestDTO.getPoint() == null || feedBackRequestDTO.getPoint() < 1.0 || feedBackRequestDTO.getPoint() > 5.0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Point must be between 1.0 and 5.0");
        }

        if (feedBackRequestDTO.getDescription() == null || feedBackRequestDTO.getDescription().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description cannot be empty");
        }

        if (feedBackRequestDTO.getUser() == null || feedBackRequestDTO.getUser().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be empty");
        }

        if (feedBackRequestDTO.getProduct() == null || feedBackRequestDTO.getProduct().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID cannot be empty");
        }
    }

    public void validateExistence(FeedBackRequestDTO feedBackRequestDTO) {
        if (userService.findUserById(feedBackRequestDTO.getUser()) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with ID " + feedBackRequestDTO.getUser() + " does not exist");
        }

        if (productService.findProductById(feedBackRequestDTO.getProduct()) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product with ID " + feedBackRequestDTO.getProduct() + " does not exist");
        }
    }
}
