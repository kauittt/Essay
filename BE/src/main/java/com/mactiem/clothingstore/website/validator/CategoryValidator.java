package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.CategoryRequestDTO;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CategoryValidator {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryValidator(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public void validateRequest(CategoryRequestDTO categoryRequestDTO) {
        validateCategoryName(categoryRequestDTO.getName());
    }

    public void validateCategoryName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category 'name' is required");
        }
        if (categoryRepository.findByName(name).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category 'name' already exists");
        }
    }

}
