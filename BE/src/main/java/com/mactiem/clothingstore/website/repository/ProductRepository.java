package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ProductRepository  extends JpaRepository<Product, String> {
}
