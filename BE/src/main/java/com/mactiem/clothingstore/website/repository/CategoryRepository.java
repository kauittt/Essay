package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Cart;
import com.mactiem.clothingstore.website.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    List<Category> findAllByNameIn(List<String> names);


//    @Query(value = "SELECT * FROM carts WHERE user_id = = CAST(:userId AS bigint)", nativeQuery = true)
//    Optional<Cart> findAllByNames(@Param("userId") String userId);
//        @Query(value = "SELECT * FROM categories WHERE name IN :names", nativeQuery = true)
//    List<Category> findByNameIn(@Param("names") List<String> names);
}
