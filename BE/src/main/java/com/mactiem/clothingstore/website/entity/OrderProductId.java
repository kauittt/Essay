package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@EqualsAndHashCode
public class OrderProductId implements Serializable {
    private Long order_id;
    private Long product_id;
    private String size;
}
