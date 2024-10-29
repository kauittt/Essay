package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.OrderRequestDTO;
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

    public void validateUpdate(FeedBackRequestDTO feedBackRequestDTO) {
        if (feedBackRequestDTO.getPoint() != null) {
            validatePointValue(feedBackRequestDTO.getPoint());
        }
    }

    // Validate the entire feedback request
    public void validateFeedBackRequest(FeedBackRequestDTO feedBackRequestDTO) {
        validatePoint(feedBackRequestDTO.getPoint());
        validateDescription(feedBackRequestDTO.getDescription());
        validateUser(feedBackRequestDTO.getUser());
        validateProduct(feedBackRequestDTO.getProduct());
//        validateImage(feedBackRequestDTO.getImage());
    }

    // Validate point
    public void validatePoint(Double point) {
        if (point == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Point cannot be empty");
        }

        validatePointValue(point);
    }

    public void validatePointValue(Double point) {
        if (point < 1.0 || point > 5.0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Point must be between 1.0 and 5.0");
        }
    }

    // Validate description
    public void validateDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description cannot be empty");
        }
    }

    public void validateImage(String image) {
        if (image == null || image.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image cannot be empty");
        }
    }

    // Validate user ID
    public void validateUser(String user) {
        if (user == null || user.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be empty");
        }
        userService.findUserById(user);
    }

    // Validate product ID
    public void validateProduct(String product) {
        if (product == null || product.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID cannot be empty");
        }

        productService.findProductById(product);
    }
}
