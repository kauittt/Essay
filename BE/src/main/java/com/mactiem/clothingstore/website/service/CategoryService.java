package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CategoryRequestDTO;
import com.mactiem.clothingstore.website.DTO.CategoryResponseDTO;
import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.CategoryMapper;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.validator.CategoryValidator;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private CategoryRepository categoryRepository;
    private CategoryMapper categoryMapper;
    private CategoryValidator categoryValidator;
    private ProductRepository productRepository;

    @Autowired
    public CategoryService(CategoryMapper categoryMapper, CategoryRepository categoryRepository, CategoryValidator categoryValidator, ProductRepository productRepository) {
        this.categoryMapper = categoryMapper;
        this.categoryRepository = categoryRepository;
        this.categoryValidator = categoryValidator;
        this.productRepository = productRepository;
    }

    //* Helper
    public Category findCategoryById(String id) {
        return categoryRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Category", id)));
    }

    public List<Category> findAllCategories() {
        Sort sort = Sort.by("name");
        return categoryRepository.findAll(sort);
    }

    public List<Category> findAllByIds(List<String> ids) {
        List<Long> longIds = ids.stream()
                .map(Long::parseLong)
                .toList();

        return categoryRepository.findAllById(longIds);
    }

    public List<Category> findAllByNames(List<String> names) {
        return categoryRepository.findAllByNameIn(names);
    }

    //* Methods
    public CategoryResponseDTO getCategoryById(String id) {
        Category category = findCategoryById(id);
        return categoryMapper.toDTO(category);
    }

    public List<CategoryResponseDTO> getAllCategories() {
        return categoryMapper.toListDTOs(findAllCategories());
    }

    @Transactional
    public CategoryResponseDTO createCategory(CategoryRequestDTO categoryRequestDTO) {
        categoryValidator.validateRequest(categoryRequestDTO);

        Category category = categoryMapper.toEntity(categoryRequestDTO);

        //* en_ fields
        if (categoryRequestDTO.getEnName() == null || categoryRequestDTO.getEnName().trim().isEmpty()) {
            category.setEnName(categoryRequestDTO.getName());
        } else {
            category.setEnName(categoryRequestDTO.getEnName());
        }

        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponseDTO updateCategory(String id, CategoryRequestDTO categoryRequestDTO) {
        Category category = findCategoryById(id);

        categoryValidator.validateUpdateRequest(categoryRequestDTO.getName(), category.getName());

        Field[] fields = categoryRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                Object value = field.get(categoryRequestDTO);
                if (value != null) {
                    Field dbField = Category.class.getDeclaredField(field.getName());
                    dbField.setAccessible(true);
                    dbField.set(category, value);
                }
            }

        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        if (categoryRequestDTO.getEnName() == null || categoryRequestDTO.getEnName().trim().isEmpty()) {
            category.setEnName(categoryRequestDTO.getName());
        }

        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(String id) {
        Category category = findCategoryById(id);

        List<Product> products = new ArrayList<>(category.getProducts());
        for (Product product : products) {
            product.getCategories().remove(category);
            productRepository.save(product);
        }

        category.setProducts(null);
        categoryRepository.save(category);

        categoryRepository.delete(category);
    }

}
