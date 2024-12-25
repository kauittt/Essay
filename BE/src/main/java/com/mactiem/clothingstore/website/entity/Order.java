package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts;

    @ManyToOne(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @OneToOne(mappedBy = "order",
            cascade = CascadeType.ALL)
    private Invoice invoice;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @Column(name = "status")
    private String status;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "province")
    private String province;//---

    @Column(name = "district")
    private String district;//---

    @Column(name = "ward")
    private String ward;//---

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
