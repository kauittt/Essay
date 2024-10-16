package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "products")
@Builder
public class Product {
    @Id
    @Column(name = "id")
    private String id;//-==...

    //* Relationship
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartProduct> cartProducts;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "products_vouchers",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "voucher_id")
    )
    private List<Voucher> vouchers;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<FeedBack> feedBacks;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "products_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;
    //*--------------------------------
    @Column(name = "name")
    private String name;//-==...

    @Column(name = "description")
    private String description;//-==...

    @Column(name = "stock")
    private int stock;//-==...

    @Column(name = "price")
    private double price;//-==...

    @Column(name = "image")
    private String image;//-==...

    //* Helper
    public List<CartProduct> getCartProducts() {
        if (cartProducts == null) {
            cartProducts = new ArrayList<>();
        }
        return cartProducts;
    }

    public List<OrderProduct> getOrderProducts() {
        if (orderProducts == null) {
            orderProducts = new ArrayList<>();
        }
        return orderProducts;
    }

    public List<Voucher> getVouchers() {
        if (vouchers == null) {
            vouchers = new ArrayList<>();
        }
        return vouchers;
    }

    public List<FeedBack> getFeedBacks() {
        if (feedBacks == null) {
            feedBacks = new ArrayList<>();
        }
        return feedBacks;
    }
}
