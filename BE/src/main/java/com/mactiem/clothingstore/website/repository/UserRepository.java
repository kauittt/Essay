package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndEmail(String username, String email);


    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

}
