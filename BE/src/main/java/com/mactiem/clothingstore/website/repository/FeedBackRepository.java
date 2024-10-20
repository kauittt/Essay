package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {
}
