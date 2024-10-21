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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring", uses = {
        ProductMapper.class
        , UserService.class
        , ProductService.class
        , InvoiceMapper.class})
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

    default List<OrderResponseDTO> toListDTOs(List<Order> orders) {
        return orders.stream().map(this::toDTO).toList();
    }

    //* Entity
    @Mapping(target = "user", source = "user", qualifiedByName = "byId")
    Order toEntity(OrderRequestDTO orderRequestDTO);

    @AfterMapping
    default void mapBasicField(@MappingTarget Order order, OrderRequestDTO orderRequestDTO) {
        order.setCreateDate(LocalDate.now());
        order.setUpdateDate(LocalDate.now());
    }

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

        Map<String, Integer> requestedQuantities = new HashMap<>();
        for (int i = 0; i < productIds.size(); i++) {
            requestedQuantities.put(productIds.get(i), Integer.parseInt(quantities.get(i)));
        }

        for (Product product : products) {
            OrderProduct op = new OrderProduct();

            OrderProductId opId = new OrderProductId(order.getId(), product.getId());
            op.setId(opId);
            op.setOrder(order);
            op.setProduct(product);
            op.setQuantity(requestedQuantities.get(String.valueOf(product.getId())));
            orderProducts.add(op);
        }
        order.setOrderProducts(orderProducts);
    }
}
