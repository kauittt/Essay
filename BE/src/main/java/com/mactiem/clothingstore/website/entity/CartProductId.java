package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class CartProductId implements Serializable {
    private Long cart_id;
    private Long product_id;
    private String size;
}
