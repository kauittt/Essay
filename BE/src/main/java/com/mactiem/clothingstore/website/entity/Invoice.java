package com.mactiem.clothingstore.website.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @Column(name = "id")
    private String id;//-==...

    @OneToOne(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Order order;//-==...

    @Column(name = "create_date")
    private LocalDate createDate;//-==...

    @Column(name = "total_amount")
    private double totalAmount;//-==...

    @Column(name = "discount_amount")
    private double discountAmount;//-==...

    @Column(name = "payment_method")
    private String paymentMethod;//-==...

    public Order getOrder() {
        if (order == null) {
            order = new Order();
        }
        return order;
    }
}
