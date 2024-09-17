package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.repository.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthorityService {
    private final AuthorityRepository authorityRepository;
//    private final AuthorityMapper authorityMapper = AuthorityMapper.INSTANCE;

    @Autowired
    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    //! Important
    @Transactional
    public List<Authority> getAllAuthoritiesByUsername(String username) {
        return authorityRepository.findAuthoritiesByUsername(username);
    }

    private Authority findAuthorityById(String id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Order", id)));
    }

//    public List<AuthorityDTO> getAllAuthorities() {
//        return authorityRepository.findAll().stream().map(authorityMapper::todTO).toList();
//    }
//
//    public AuthorityDTO getAuthorityById(String id) {
//        return authorityMapper.todTO(findAuthorityById(id));
//    }
}
