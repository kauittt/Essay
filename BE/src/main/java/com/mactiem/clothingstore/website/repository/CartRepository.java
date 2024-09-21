package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    @Query(value = "SELECT * FROM carts WHERE user_id = :userId", nativeQuery = true)
    Optional<Cart> findCartByUserId(@Param("userId") String userId);

    @Query(value = "SELECT c FROM carts c JOIN users u ON c.user_id = u.id" +
            " WHERE u.username = :username", nativeQuery = true)
    Optional<Cart> findCartByUsername(@Param("username") String username);

    @Query(value = "DELETE FROM cart_products WHERE cart_id = :cartId", nativeQuery = true)
    void deleteProductsByCartId(@Param("cartId") String cartId);
}
