package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Cart;
import com.mactiem.clothingstore.website.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findVoucherByName(String name);
}
