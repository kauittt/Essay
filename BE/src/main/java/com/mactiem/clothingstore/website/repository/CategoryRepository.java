package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
