package com.mactiem.clothingstore.website.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "vouchers")
public class Voucher {
    @Id
    @Column(name = "id")
    private String id;//-

    @ManyToMany(mappedBy = "vouchers",
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Product> products;//-

    @Column(name = "discount_percentage")
    private double discountPercentage;//-

    @Column(name = "name")
    private String name;//-

    @Column(name = "start_date")
    private LocalDate startDate;//-

    @Column(name = "end_date")
    private LocalDate endDate;//-

    @Column(name = "quantity")
    private int quantity;//-

    public List<Product> getProducts() {
        if (products == null) {
            products = new ArrayList<>();
        }
        return products;
    }
}
