package com.mactiem.clothingstore.website.entity;

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
@Table(name = "feedbacks")
@Builder
public class FeedBack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;//-==...

    @ManyToOne(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    private User user;//-==...

    @ManyToOne(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "product_id")
    private Product product;//-==...

    @Column(name = "create_date")
    private LocalDate createDate;//-==...

    @Column(name = "update_date")
    private LocalDate updateDate;//-==...

    @Column(name = "point")
    private Double point;//-==...

    @Column(name = "description")
    private String description;//-==...

    @Column(name = "image")
    private String image;

    public User getUser() {
        if (user == null) {
            user = new User();
        }
        return user;
    }

    public Product getProduct() {
        if (product == null) {
            product = new Product();
        }
        return product;
    }
}
