package com.mactiem.clothingstore.website.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "vouchers")
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;//-

    @ManyToMany(mappedBy = "vouchers",
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Product> products;//-

    @Column(name = "discount_percentage")
    private double discountPercentage;//-

    @Column(name = "minRequire")
    private double minRequire;//-

    @Column(name = "maxDiscount")
    private double maxDiscount;//-

    @Column(name = "name")
    private String name;//-

    @Column(name = "en_name")
    private String enName;//-

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
