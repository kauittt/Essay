package com.mactiem.clothingstore.website.service;


import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.entity.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserService userService;
    private final AuthorityService authorityService;

    @Autowired
    public CustomUserDetailsService(AuthorityService authorityService, UserService userService) {
        this.authorityService = authorityService;
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        //- load Authorities
        List<Authority> authorities = authorityService.getAllAuthoritiesByUsername(username);
        user.setAuthorities(Objects.requireNonNullElseGet(authorities, List::of));

        return new UserPrincipal(user);
    }
}


