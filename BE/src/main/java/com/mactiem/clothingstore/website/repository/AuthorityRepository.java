package com.mactiem.clothingstore.website.repository;

import com.mactiem.clothingstore.website.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
    @Query(value = "SELECT A.* FROM users_authorities UA " +
            "JOIN authorities A ON UA.authority_id = A.id " +
            "JOIN users U ON  UA.user_id = U.id " +
            "WHERE U.username = :username", nativeQuery = true)
    List<Authority> findAuthoritiesByUsername(@Param("username") String username);

    List<Authority> findByAuthorityIn(List<String> authorities);

}
