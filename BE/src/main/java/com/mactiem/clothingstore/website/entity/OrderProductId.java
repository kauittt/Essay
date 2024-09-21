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
public class OrderProductId implements Serializable {
    private String order_id;
    private String product_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderProductId that)) return false;
        return Objects.equals(getOrder_id(), that.getOrder_id()) && Objects.equals(getProduct_id(), that.getProduct_id());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getOrder_id(), getProduct_id());
    }
}
