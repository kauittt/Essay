package com.mactiem.clothingstore.website.mapstruct;

import com.mactiem.clothingstore.website.DTO.*;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.service.CartService;
import com.mactiem.clothingstore.website.service.ProductService;
import com.mactiem.clothingstore.website.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Mapper(componentModel = "spring", uses = {
        ProductMapper.class
        , UserService.class
        , ProductService.class
        , InvoiceMapper.class
        , VoucherMapper.class})
@Component
public interface OrderMapper {
    //* DTO
    OrderResponseDTO toDTO(Order order);

    @AfterMapping
    default void mapOrderProductsDTO(@MappingTarget OrderResponseDTO orderResponseDTO, Order order, ProductMapper productMapper) {
        for (OrderProduct orderProduct : order.getOrderProducts()) {
            OrderProductDTO dto = new OrderProductDTO();
            dto.setQuantity(orderProduct.getQuantity());
            dto.setProduct(productMapper.toDTO(orderProduct.getProduct()));

            orderResponseDTO.getOrderProducts().add(dto);
        }
    }

    @AfterMapping
    default void mapInvoice(@MappingTarget OrderResponseDTO orderResponseDTO, Order order, InvoiceMapper invoiceMapper) {
        orderResponseDTO.setInvoice(invoiceMapper.toDTO(order.getInvoice()));
    }

    @AfterMapping
    default void mapVoucher(@MappingTarget OrderResponseDTO orderResponseDTO, Order order, VoucherMapper voucherMapper) {
        orderResponseDTO.setVoucher(voucherMapper.toDTO(order.getVoucher()));
    }

    default List<OrderResponseDTO> toListDTOs(List<Order> orders) {
        return orders.stream().map(this::toDTO).toList();
    }

    //* Entity
    @Mapping(target = "user", source = "user", qualifiedByName = "byId")
    @Mapping(target = "voucher", source = "voucher", ignore = true)
    Order toEntity(OrderRequestDTO orderRequestDTO);

//    @AfterMapping
//    default void mapBasicField(@MappingTarget Order order, OrderRequestDTO orderRequestDTO) {
//        order.setCreateDate(LocalDate.now());
//        order.setUpdateDate(LocalDate.now());
//    }

    @AfterMapping
    default void mapUser(@MappingTarget Order order, OrderRequestDTO orderRequestDTO, UserService userService) {
        order.setUser(userService.findUserById(orderRequestDTO.getUser()));
    }

    //! Gọi ở chổ gọi .toEntity()
    default void mapOrderProductsEntity(Order order, OrderRequestDTO orderRequestDTO
            , ProductService productService) {

        List<OrderProduct> orderProducts = new ArrayList<>();

        List<Product> products = productService.findProductsByIds(orderRequestDTO.getProducts());

        List<String> productIds = orderRequestDTO.getProducts();
        List<String> quantities = orderRequestDTO.getQuantities();
        List<String> sizes = orderRequestDTO.getSizes();

        for (int i = 0; i < productIds.size(); i++) {
            Long id = Long.parseLong(productIds.get(i));
            String size = sizes.get(i);
            int quantity = Integer.parseInt(quantities.get(i));

            Optional<Product> productOpt = products.stream().filter(p -> p.getId().equals(id)).findFirst();

            if (productOpt.isEmpty()) {
                throw new IllegalArgumentException("Product with ID " + id + " not found in the provided product list.");
            }

            Product product = productOpt.get();

            OrderProductId opId = new OrderProductId(order.getId(), product.getId(), size);

            OrderProduct op = new OrderProduct();
            op.setId(opId);
            op.setOrder(order);
            op.setProduct(product);
            op.setQuantity(quantity);
            orderProducts.add(op);

            //* Trừ stock vì đã order
            Optional<SizeProduct> sizeProductOpt = product.getSizeProducts().stream()
                    .filter(sp -> sp.getSize().getName().equals(size))
                    .findFirst();

            if (sizeProductOpt.isPresent()) {
                SizeProduct sizeProduct = sizeProductOpt.get();
                sizeProduct.setStock(sizeProduct.getStock() - quantity);
            } else {
                throw new NoSuchElementException("No size product found for product ID: " + id + " and size: " + size);
            }
        }

        order.setOrderProducts(orderProducts);
    }
}
