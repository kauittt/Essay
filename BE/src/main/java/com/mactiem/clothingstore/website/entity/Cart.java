package com.mactiem.clothingstore.website.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "carts")
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long  id;

    @OneToOne(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartProduct> cartProducts;

    public Cart(List<CartProduct> cartProducts, User user) {
        this.cartProducts = cartProducts;
        this.user = user;
    }

    public User getUser() {
        if (user == null) {
            user = new User();
        }
        return user;
    }

    public List<CartProduct> getCartProducts() {
        if (cartProducts == null) {
            cartProducts = new ArrayList<>();
        }
        return cartProducts;
    }
}
