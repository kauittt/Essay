package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "sizes_products")
@Builder
public class SizeProduct {
    @EmbeddedId
    private SizeProductId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sizeId")
    @JoinColumn(name = "size_id")
    private Size size;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "stock")
    private int stock;

    @Column(name = "update_date")
    private LocalDate updateDate;
}
