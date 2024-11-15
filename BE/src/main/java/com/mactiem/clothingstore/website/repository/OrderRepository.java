package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT * FROM orders WHERE user_id = CAST(:userId AS UNSIGNED)", nativeQuery = true)
    List<Order> findOrdersByUserId(@Param("userId") String userId);

    @Query(value = "SELECT o FROM orders o JOIN users u " +
            "ON o.user_id = u.id" +
            "WHERE u.username = :username", nativeQuery = true)
    List<Order> findOrdersByUsername(@Param("username") String username);
}
