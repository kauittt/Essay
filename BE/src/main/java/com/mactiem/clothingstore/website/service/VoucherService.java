package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.DTO.VoucherResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.VoucherMapper;
import com.mactiem.clothingstore.website.repository.VoucherRepository;
import com.mactiem.clothingstore.website.validator.VoucherValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    private final VoucherValidator voucherValidator;
    private final ProductService productService;

    @Autowired
    public VoucherService(VoucherMapper voucherMapper, VoucherRepository voucherRepository, VoucherValidator voucherValidator, ProductService productService) {
        this.voucherMapper = voucherMapper;
        this.voucherRepository = voucherRepository;
        this.voucherValidator = voucherValidator;
        this.productService = productService;
    }

    //* Helper
    public Voucher findVoucherById(String id) {
        return voucherRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Voucher", id)));
    }

    public List<Voucher> findVouchersByIds(List<String> vouchers) {
        List<Long> longIds = vouchers.stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());

        return voucherRepository.findAllById(longIds);
    }

    public List<Voucher> findAllVouchers() {
        Sort sort = Sort.by("name");
        return voucherRepository.findAll(sort);
    }

    //* Methods
    public VoucherResponseDTO getVoucherById(String id) {
        return voucherMapper.toDTO(findVoucherById(id));
    }

    public List<VoucherResponseDTO> getAllVouchers() {
        return voucherMapper.toListDTOs(findAllVouchers());
    }

    @Transactional
    public VoucherResponseDTO createVoucher(VoucherRequestDTO voucherRequestDTO) {
        voucherValidator.validateVoucherRequest(voucherRequestDTO);

        Voucher voucher = voucherMapper.toEntity(voucherRequestDTO);
        voucher.setDiscountPercentage(voucherRequestDTO.getDiscountPercentage() / 100); //- input: 10 -> save: 0.1

        List<Product> products;

        if (!voucherRequestDTO.getProducts().isEmpty()) {
            products = productService.findProductsByIds(voucherRequestDTO.getProducts());
        } else {
            products = productService.findAllProducts();
        }

        voucher.setProducts(products);

        for (Product product : products) {
            product.getVouchers().add(voucher);
        }

        //* en_ fields
        if (voucherRequestDTO.getEnName() == null || voucherRequestDTO.getEnName().trim().isEmpty()) {
            voucher.setEnName(voucherRequestDTO.getName());
        } else {
            voucher.setEnName(voucherRequestDTO.getEnName());
        }


        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Transactional
    public VoucherResponseDTO updateVoucher(String id, VoucherRequestDTO voucherRequestDTO) {
        Voucher voucher = findVoucherById(id);

        voucherValidator.validateForUpdate(voucherRequestDTO, voucher);

        Field[] fields = voucherRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("products") && !field.getName().equals("startDate")) {
                    Object value = field.get(voucherRequestDTO);
                    if (value != null) {
                        Field dbField = Voucher.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(voucher, value);
                    }
                }
            }
        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        if (voucherRequestDTO.getEnName() == null || voucherRequestDTO.getEnName().trim().isEmpty()) {
            voucher.setEnName(voucherRequestDTO.getName());
        }

        if (voucherRequestDTO.getDiscountPercentage() != null) {
            voucher.setDiscountPercentage(voucherRequestDTO.getDiscountPercentage() / 100);
        }

//        if (voucherRequestDTO.getProducts() != null) {
//            if (!voucherRequestDTO.getProducts().isEmpty()) {
//                voucher.setProducts(productService.findProductsByIds(voucherRequestDTO.getProducts()));
//            } else {
//                voucher.setProducts(productService.findAllProducts());
//            }
//        }
        updateProductRelationships(voucher, voucherRequestDTO);
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    private void updateProductRelationships(Voucher voucher, VoucherRequestDTO voucherRequestDTO) {
        voucher.getProducts().forEach(product -> product.getVouchers().remove(voucher));
        voucher.setProducts(new ArrayList<>()); // Clear the existing products list

        List<Product> newProducts;
        if (voucherRequestDTO.getProducts() != null && !voucherRequestDTO.getProducts().isEmpty()) {
            newProducts = productService.findProductsByIds(voucherRequestDTO.getProducts());
        } else {
            newProducts = productService.findAllProducts();
        }
        voucher.setProducts(newProducts);

        newProducts.forEach(product -> product.getVouchers().add(voucher));
    }

    @Transactional
    public void deleteVoucher(String id) {
        Voucher voucher = findVoucherById(id);

        List<Product> products = voucher.getProducts();
        if (products != null) {
            for (Product product : products) {
                product.getVouchers().remove(voucher);
            }
        }
        voucherRepository.delete(voucher);
    }
}
