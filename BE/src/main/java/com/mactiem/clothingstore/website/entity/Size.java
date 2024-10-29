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
@Table(name = "sizes")
@Builder
public class Size {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;//-==...

    @Column(name = "size")
    private String name;

    @OneToMany(mappedBy = "size", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SizeProduct> sizeProducts;

    public List<SizeProduct> getSizeProducts() {
        if(sizeProducts == null) {
            return new ArrayList<>();
        }
        return sizeProducts;
    }
}
