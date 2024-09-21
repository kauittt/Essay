package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CartProductId implements Serializable {
    private String cart_id;
    private String product_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartProductId that)) return false;
        return Objects.equals(getCart_id(), that.getCart_id()) && Objects.equals(getProduct_id(), that.getProduct_id());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getCart_id(), getProduct_id());
    }
}
