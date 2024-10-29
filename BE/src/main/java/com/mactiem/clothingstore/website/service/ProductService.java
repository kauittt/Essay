package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.CategoryProductsDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.DTO.SizeProductDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import com.mactiem.clothingstore.website.repository.ProductRepository;
import com.mactiem.clothingstore.website.repository.SizeRepository;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;
    private final ProductMapper productMapper;
    private final ProductValidator productValidator;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @Autowired
    public ProductService(ProductMapper productMapper, ProductRepository productRepository, SizeRepository sizeRepository, ProductValidator productValidator, CategoryRepository categoryRepository, CategoryService categoryService) {
        this.productMapper = productMapper;
        this.productRepository = productRepository;
        this.sizeRepository = sizeRepository;
        this.productValidator = productValidator;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    //* Helper
    public Product findProductById(String id) {
        return productRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Product", id)));
    }

    public List<Product> findProductsByIds(List<String> productIds) {
        List<Long> longIds = productIds.stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());

        return productRepository.findAllById(longIds);
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
        List<Category> categories = categoryService.findAllByNames(productRequestDTO.getCategories());
        product.setCategories(categories);

        categories.forEach(category -> category.getProducts().add(product));

        //* en_ fields
//        if (productRequestDTO.getEnName() == null || productRequestDTO.getEnName().trim().isEmpty()) {
//            product.setEnName(productRequestDTO.getName());
//        } else {
//            product.setEnName(productRequestDTO.getEnName());
//        }
//
//        if (productRequestDTO.getEnDescription() == null || productRequestDTO.getEnDescription().trim().isEmpty()) {
//            product.setEnDescription(productRequestDTO.getDescription());
//        } else {
//            product.setEnDescription(productRequestDTO.getEnDescription());
//        }

        //* Size
        List<Size> sizes = sizeRepository.findAll();
        Map<String, Integer> sizeQuantities = new HashMap<>();

        for (int i = 0; i < productRequestDTO.getSizes().size(); i++) {
            sizeQuantities.put(productRequestDTO.getSizes().get(i), Integer.parseInt(productRequestDTO.getQuantities().get(i)));
        }

        for (Size size : sizes) {
            SizeProductId sizeProductId = new SizeProductId(size.getId(), product.getId());
            Integer stock = sizeQuantities.getOrDefault(size.getName(), 0);
            SizeProduct sizeProduct = new SizeProduct(sizeProductId,
                    size,
                    product,
                    stock,
                    LocalDate.now());

            product.getSizeProducts().add(sizeProduct);
            size.getSizeProducts().add(sizeProduct);
        }

        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    @Transactional
    public ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO) {
        Product product = findProductById(id);
        productValidator.validateUpdate(productRequestDTO);

        if(productRequestDTO.getSizes() != null && productRequestDTO.getQuantities() != null) {
            System.out.println("Dang set SIZES");
            updateProductSizes(product, productRequestDTO);
        }

        if(productRequestDTO.getCategories() != null ) {
            updateProductCategories(product, productRequestDTO);

        }
        updateOtherProductFields(product, productRequestDTO);

        return productMapper.toDTO(productRepository.save(product));
    }

    //* Helper
    private void updateProductSizes(Product product, ProductRequestDTO productRequestDTO) {
        Map<String, Integer> sizeQuantities = new HashMap<>();

        for (int i = 0; i < productRequestDTO.getSizes().size(); i++) {
            sizeQuantities.put(productRequestDTO.getSizes().get(i), Integer.parseInt(productRequestDTO.getQuantities().get(i)));
        }

        product.getSizeProducts().forEach(sizeProduct -> {
            System.out.println(sizeProduct);
            if (sizeQuantities.containsKey(sizeProduct.getSize().getName())) {
                sizeProduct.setStock(sizeQuantities.get(sizeProduct.getSize().getName()));
                sizeProduct.setUpdateDate(LocalDate.now());
            }
        });
    }

    private void updateProductCategories(Product product, ProductRequestDTO productRequestDTO) {
        List<String> incomingCategoryIds = productRequestDTO.getCategories(); // Assuming categories is a list of category IDs
        List<Category> currentCategories = product.getCategories();
        List<Category> newCategories = categoryService.findAllByNames(incomingCategoryIds);

        currentCategories.removeIf(category -> !incomingCategoryIds.contains(category.getName()));

        newCategories.stream()
                .filter(newCategory -> !currentCategories.contains(newCategory))
                .forEach(currentCategories::add);

        product.setCategories(currentCategories);
    }

    private void updateOtherProductFields(Product product, ProductRequestDTO productRequestDTO) {
        Field[] fields = productRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("categories") && !field.getName().equals("sizes") && !field.getName().equals("quantities")) {
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
    }

//    @Transactional
//    public ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO) {
//        Product product = findProductById(id);
//
//        productValidator.validateUpdate(productRequestDTO);
//
//        //* Sizes
//        Map<String, Integer> sizeQuantities = new HashMap<>();
//
//        for (int i = 0; i < productRequestDTO.getSizes().size(); i++) {
//            sizeQuantities.put(productRequestDTO.getSizes().get(i), Integer.parseInt(productRequestDTO.getQuantities().get(i)));
//        }
//
//        product.getSizeProducts().forEach(sizeProduct -> {
//            if (sizeQuantities.containsKey(sizeProduct.getSize().getName())) {
//                sizeProduct.setStock(sizeQuantities.get(sizeProduct.getSize().getName()));
//                sizeProduct.setUpdateDate(LocalDate.now());
//            }
//        });
//
//        //* Handle Category changes
//        List<String> incomingCategoryIds = productRequestDTO.getCategories(); // Assuming categories is a list of category IDs in ProductRequestDTO
//        List<Category> currentCategories = product.getCategories();
//
//        // Convert incomingCategoryIds to Category objects
//        List<Category> newCategories = categoryService.findAllByNames(incomingCategoryIds);
//
//        currentCategories.removeIf(category -> !incomingCategoryIds.contains(category.getName()));
//
//        for (Category newCategory : newCategories) {
//            if (!currentCategories.contains(newCategory)) {
//                currentCategories.add(newCategory);
//            }
//        }
//
//        product.setCategories(currentCategories);
//
//        Field[] fields = productRequestDTO.getClass().getDeclaredFields();
//        try {
//            for (Field field : fields) {
//                field.setAccessible(true);
//                if (!field.getName().equals("categories")
//                        && !field.getName().equals("sizes")
//                        && !field.getName().equals("quantities")) {
//                    Object value = field.get(productRequestDTO);
//                    if (value != null) {
//                        Field dbField = Product.class.getDeclaredField(field.getName());
//                        dbField.setAccessible(true);
//                        dbField.set(product, value);
//                    }
//                }
//            }
//
//        } catch (IllegalAccessException | NoSuchFieldException e) {
//            throw new RuntimeException("Error updating fields", e);
//        }
//
//        return productMapper.toDTO(productRepository.save(product));
//    }


    @Transactional
    public void deleteProduct(String id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

}
