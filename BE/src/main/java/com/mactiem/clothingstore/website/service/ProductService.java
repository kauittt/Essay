package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CategoryProductsDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductValidator productValidator;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @Autowired
    public ProductService(ProductMapper productMapper, ProductRepository productRepository, ProductValidator productValidator, CategoryRepository categoryRepository, CategoryService categoryService) {
        this.productMapper = productMapper;
        this.productRepository = productRepository;
        this.productValidator = productValidator;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    //* Helper
    public Product findProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Product", id)));
    }

    public List<Product> findProductsByIds(List<String> products) {
        return productRepository.findAllById(products);
    }

    public List<Product> findAllProducts() {
        Sort sort = Sort.by("name");
        return productRepository.findAll(sort);
    }

    //* Methods
    public ProductResponseDTO getProductById(String id) {
        Product product = findProductById(id);
        return productMapper.toDTO(product);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productMapper.toListDTOs(findAllProducts());
    }

//    public List<CategoryProductsDTO> getProductsGroupedByCategory() {
//        List<ProductResponseDTO> productResponseDTOs = getAllProducts();
//        Map<String, List<ProductResponseDTO>> groupedProducts = productResponseDTOs.stream()
//                .filter(product -> product.getCategories() != null)
//                .collect(Collectors.groupingBy(ProductResponseDTO::getCategories));
//
//        return groupedProducts.entrySet().stream()
//                .map(entry -> new CategoryProductsDTO(entry.getKey(), entry.getValue()))
//                .collect(Collectors.toList());
//    }

    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        productValidator.validateProductRequest(productRequestDTO);

        Product product = productMapper.toEntity(productRequestDTO);
        product.setId(GenerateID.generateID());

        return productMapper.toDTO(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO) {
        Product product = findProductById(id);

        productValidator.validateUpdate(productRequestDTO);

        //* Handle Category changes
        List<String> incomingCategoryIds = productRequestDTO.getCategories(); // Assuming categories is a list of category IDs in ProductRequestDTO
        List<Category> currentCategories = product.getCategories();

        // Convert incomingCategoryIds to Category objects
        List<Category> newCategories = categoryService.findAllByIds(incomingCategoryIds);

        currentCategories.removeIf(category -> !incomingCategoryIds.contains(category.getId()));

        for (Category newCategory : newCategories) {
            if (!currentCategories.contains(newCategory)) {
                currentCategories.add(newCategory);
            }
        }

        product.setCategories(currentCategories);

        Field[] fields = productRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("categories")) {
                    Object value = field.get(productRequestDTO);
                    if (value != null) {
                        Field dbField = Product.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(product, value);
                    }
                }
            }

        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        return productMapper.toDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

}
