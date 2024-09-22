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

    public void validateUpdate(UserRegistryDTO userRequestDTO) {
        if (userRequestDTO.getPassword() != null) {
            validatePassword(userRequestDTO.getPassword());
        }

        if (userRequestDTO.getEmail() != null) {
            validateEmail(userRequestDTO.getEmail());
        }

        if (userRequestDTO.getPhone() != null) {
            validatePhone(userRequestDTO.getPhone());
        }

        if (userRequestDTO.getAuthorities() != null) {
            validateAuthorities(userRequestDTO.getAuthorities());
        }
    }

    public void validateUserRegistration(UserRegistryDTO userRequestDTO) {
        validateUsername(userRequestDTO.getUsername());
        validatePassword(userRequestDTO.getPassword());
        validateEmail(userRequestDTO.getEmail());
        validateName(userRequestDTO.getName());
        validatePhone(userRequestDTO.getPhone());
        validateAddress(userRequestDTO.getAddress());
        validateAuthorities(userRequestDTO.getAuthorities());
    }

    public void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (userRepository.findByUsername(username) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
    }

    //- Password Strength
    public void validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
//        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$";
//        if (password.length() < 8 || !Pattern.matches(passwordPattern, password)) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters and include at least one digit, one lowercase letter, one uppercase letter, and one special character");
//        }
    }

    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        String emailPattern = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}$";
        if (!Pattern.matches(emailPattern, email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format");
        }
    }

    public void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
    }

    public void validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone is required");
        }
        String phonePattern = "^0[0-9]{9}$";
        if (!Pattern.matches(phonePattern, phone)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid phone format");
        }
    }

    public void validateAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address is required");
        }
    }

    public void validateAuthorities(List<String> authorityIds) {
        if (authorityIds == null || authorityIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorities cannot be null or empty");
        }
        List<Authority> authorities = authorityService.getAuthoritiesByNames(authorityIds);
        if (authorities.size() != authorityIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not all authorities are found");
        }
    }
}
