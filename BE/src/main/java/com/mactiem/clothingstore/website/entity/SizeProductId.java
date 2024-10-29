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
public class SizeProductId implements Serializable {
    private Long sizeId;
    private Long productId;
}
