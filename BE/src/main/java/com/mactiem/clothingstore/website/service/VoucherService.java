package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.DTO.VoucherRequestDTO;
import com.mactiem.clothingstore.website.DTO.VoucherResponseDTO;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.entity.Voucher;
import com.mactiem.clothingstore.website.mapstruct.VoucherMapper;
import com.mactiem.clothingstore.website.repository.VoucherRepository;
import com.mactiem.clothingstore.website.validator.VoucherValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.List;

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

    //- Helper
    public Voucher findVoucherById(String id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Voucher", id)));
    }

    public List<Voucher> findVouchersByIds(List<String> vouchers) {
        return voucherRepository.findAllById(vouchers);
    }

    public List<Voucher> findAllVouchers() {
        return voucherRepository.findAll();
    }

    //- Methods
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

        if (voucherRequestDTO.getDiscountPercentage() != null) {
            voucher.setDiscountPercentage(voucherRequestDTO.getDiscountPercentage() / 100);
        }

        if (voucherRequestDTO.getProducts() != null) {
            if (!voucherRequestDTO.getProducts().isEmpty()) {
                voucher.setProducts(productService.findProductsByIds(voucherRequestDTO.getProducts()));
            } else {
                voucher.setProducts(productService.findAllProducts());
            }
        }

        return voucherMapper.toDTO(voucherRepository.save(voucher));
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
