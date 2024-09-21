package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CategoryProductsDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductValidator productValidator;

    @Autowired
    public ProductService(ProductMapper productMapper, ProductRepository productRepository, ProductValidator productValidator) {
        this.productMapper = productMapper;
        this.productRepository = productRepository;
        this.productValidator = productValidator;
    }

    //- Helper
    public Product findProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Product", id)));
    }

    public List<Product> findProductsByIds(List<String> products) {
        return productRepository.findAllById(products);
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    //- Methods
    public ProductResponseDTO getProductById(String id) {
        Product product = findProductById(id);
        return productMapper.toDTO(product);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productMapper.toListDTOs(findAllProducts());
    }

    public List<CategoryProductsDTO> getProductsGroupedByCategory() {
        List<ProductResponseDTO> productResponseDTOs = getAllProducts();
        Map<String, List<ProductResponseDTO>> groupedProducts = productResponseDTOs.stream()
                .filter(product -> product.getCategory() != null)
                .collect(Collectors.groupingBy(ProductResponseDTO::getCategory));

        return groupedProducts.entrySet().stream()
                .map(entry -> new CategoryProductsDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        productValidator.validateProductRequest(productRequestDTO);

        Product product = productMapper.toEntity(productRequestDTO);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO) {
        Product product = findProductById(id);

        Field[] fields = productRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                    Object value = field.get(productRequestDTO);
                    if (value != null) {
                        Field dbField = User.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(product, value);
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
