package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private String id;//---

    //-------------------------------
    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "users_authorities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id")
    )
    private List<Authority> authorities;//---

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;//-

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FeedBack> feedBacks;

    //-------------------------------
    @Column(name = "username")
    private String username;//---

    @Column(name = "password")
    private String password;//---

    @Column(name = "enabled")
    private Integer enabled;//---

    @Column(name = "email")
    private String email;//---

    @Column(name = "name")
    private String name;//---

    @Column(name = "phone")
    private String phone;//---

    @Column(name = "address")
    private String address;//---

    @Column(name = "create_date")
    private LocalDate createDate;//---

    @Column(name = "update_date")
    private LocalDate updateDate;//---

    public List<Authority> getAuthorities() {
        if (authorities == null) {
            authorities = new ArrayList<>();
        }
        return authorities;
    }

    public Cart getCart() {
        if (cart == null) {
            cart = new Cart();
        }
        return cart;
    }

    public List<Order> getOrders() {
        if (orders == null) {
            orders = new ArrayList<>();
        }
        return orders;
    }

    public List<FeedBack> getFeedBacks() {
        if (feedBacks == null) {
            feedBacks = new ArrayList<>();
        }
        return feedBacks;
    }
}
