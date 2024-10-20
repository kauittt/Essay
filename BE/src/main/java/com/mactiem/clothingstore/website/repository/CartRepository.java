package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query(value = "SELECT * FROM carts WHERE user_id = = CAST(:userId AS bigint)", nativeQuery = true)
    Optional<Cart> findCartByUserId(@Param("userId") String userId);

    @Query(value = "SELECT c FROM carts c JOIN users u ON c.user_id = u.id" +
            " WHERE u.username = :username", nativeQuery = true)
    Optional<Cart> findCartByUsername(@Param("username") String username);

    @Modifying
    @Query(value = "DELETE FROM carts_products WHERE cart_id = CAST(:cartId AS bigint)", nativeQuery = true)
    void deleteProductsByCartId(@Param("cartId") String cartId);
}
