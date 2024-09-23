package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @Column(name = "id")
    private String id;//-==...

    @ManyToOne(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    private User user;//-==...

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts;//-==...

    @OneToOne(mappedBy = "order",
            cascade = CascadeType.ALL)
    private Invoice invoice;

    @Column(name = "create_date")
    private LocalDate createDate;//-==...

    @Column(name = "update_date")
    private LocalDate updateDate;//-==...

    @Column(name = "status")
    private String status;//-==...

    @Column(name = "name")
    private String name;//-==...

    @Column(name = "phone")
    private String phone;//-==...

    @Column(name = "address")
    private String address;//-==...

    public User getUser() {
        if (user == null) {
            user = new User();
        }
        return user;
    }

    public List<OrderProduct> getOrderProducts() {
        if (orderProducts == null) {
            orderProducts = new ArrayList<>();
        }
        return orderProducts;
    }

//    public Invoice getInvoice() {
//
//        if (invoice == null) {
//            invoice = new Invoice();
//        }
//        return invoice;
//    }
}
