package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
}
