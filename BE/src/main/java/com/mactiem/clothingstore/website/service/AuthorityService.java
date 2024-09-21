package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.AuthorityMapper;
import com.mactiem.clothingstore.website.repository.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthorityService {
    private final AuthorityRepository authorityRepository;

    @Autowired
    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    //! Important
    @Transactional
    public List<Authority> getAllAuthoritiesByUsername(String username) {
        return authorityRepository.findAuthoritiesByUsername(username);
    }

    private Authority getAuthorityById(String id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("Authority", id)));
    }

    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

    public List<Authority> getAuthoritiesByNames(List<String> names) {
        return authorityRepository.findByAuthorityIn(names);
    }
//    public List<Authority> getAuthoritiesByIds(List<String> authorityIds) {
//        return authorityRepository.findAllById(authorityIds);
//    }


}
