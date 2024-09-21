package com.mactiem.clothingstore.website.validator;

import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.repository.UserRepository;
import com.mactiem.clothingstore.website.service.AuthorityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class UserValidator {

    private final UserRepository userRepository;
    private final AuthorityService authorityService;

    @Autowired
    public UserValidator(UserRepository userRepository, AuthorityService authorityService) {
        this.userRepository = userRepository;
        this.authorityService = authorityService;
    }

    public void validateRequiredFields(UserRegistryDTO userRequestDTO) {
        if (userRequestDTO.getUsername() == null || userRequestDTO.getUsername().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }

        if (userRequestDTO.getPassword() == null || userRequestDTO.getPassword().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        if (userRequestDTO.getAuthorities() == null || userRequestDTO.getAuthorities().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorities cannot be null or empty");
        }
    }

    public void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
        }

        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$";
        if (!Pattern.matches(passwordPattern, password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character");
        }
    }

    public void validateUniqueUsername(UserRegistryDTO userRequestDTO) {
        if (userRepository.findByUsername(userRequestDTO.getUsername()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
    }

    public void validateAuthoritiesExistence(List<String> authorityIds) {
        List<Authority> authorities = authorityService.getAuthoritiesByNames(authorityIds);

        if (authorities == null || authorities.size() != authorityIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not all authorities are found");
        }
    }
}
