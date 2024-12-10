package com.mactiem.clothingstore.website.service;


import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.CartMapper;
import com.mactiem.clothingstore.website.mapstruct.ProductMapper;
import com.mactiem.clothingstore.website.mapstruct.UserMapper;
import com.mactiem.clothingstore.website.repository.CartRepository;
import com.mactiem.clothingstore.website.repository.UserRepository;
import com.mactiem.clothingstore.website.security.SecurityUtils;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import com.mactiem.clothingstore.website.validator.UserValidator;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityService authorityService;
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final ProductMapper productMapper;

    @Autowired
    @Lazy
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, AuthorityService authorityService, UserValidator userValidator, CartRepository cartRepository, CartMapper cartMapper, ProductMapper productMapper) {
        this.authorityService = authorityService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userValidator = userValidator;
        this.cartRepository = cartRepository;
        this.cartMapper = cartMapper;
        this.productMapper = productMapper;
    }

    //* Helpers
    @Named("byUsername")
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(Response.notFound("User", username)));
    }

    @Named("byId")
    public User findUserById(String id) {
        return userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("User", id)));
    }

    @Named("byUsernameAndEmail")
    public User findUserByUsernameAndEmail(String username, String email) {
        return userRepository.findByUsernameAndEmail(username, email)
                .orElseThrow(() -> new RuntimeException(Response.notFound("User", username)));
    }

    //* Methods
    public UserResponseDTO getUserById(String id) {
        User user = findUserById(id);
        return mapUserDTO(user);
    }

    public UserResponseDTO getCurrentUser() {
        User user = findUserById(SecurityUtils.getCurrentUserId());
        return mapUserDTO(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        Sort sort = Sort.by("name");
        List<User> users = userRepository.findAll(sort);
        return mapListUser(users);
    }

    @Transactional
    public UserResponseDTO createUser(UserRegistryDTO userRequestDTO) {
        userValidator.validateUserRegistration(userRequestDTO);

        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        userRequestDTO.setPassword(hashedPassword);

        //* Mapping
        User user = userMapper.toEntity(userRequestDTO);
        Cart cart = new Cart(new ArrayList<>(), user);
        user.setCart(cart);
        user.setCreateDate(LocalDate.now());
        user.setUpdateDate(LocalDate.now());
        user.setEnabled(1);

        cartRepository.save(cart);
        return mapUserDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO update(String id, UserRegistryDTO userRequestDTO) {
        User dbUser = findUserById(id);

        userValidator.validateUpdate(userRequestDTO, dbUser);

        Field[] fields = userRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("username")
                        && !field.getName().equals("authorities")
                        && !field.getName().equals("password")) {
                    Object value = field.get(userRequestDTO);
                    if (value != null) {
                        Field dbField = User.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(dbUser, value);
                    }
                }
            }
        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        if (userRequestDTO.getAuthorities() != null) {
            List<Authority> authorities = authorityService.getAuthoritiesByNames(userRequestDTO.getAuthorities());
            dbUser.setAuthorities(authorities);
        }

        if (userRequestDTO.getPassword() != null) {
            dbUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }
        dbUser.setUpdateDate(LocalDate.now());

        return mapUserDTO(userRepository.save(dbUser));
    }

    @Transactional
    public UserResponseDTO updateCurrentUser(UserRegistryDTO userRequestDTO) {
        User dbUser = findUserById(SecurityUtils.getCurrentUserId());

        userValidator.validateUpdate(userRequestDTO, dbUser);

        Field[] fields = userRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("username")
                        && !field.getName().equals("authorities")
                        && !field.getName().equals("password")) {
                    Object value = field.get(userRequestDTO);
                    if (value != null) {
                        Field dbField = User.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(dbUser, value);
                    }
                }
            }
        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        if (userRequestDTO.getAuthorities() != null) {
            List<Authority> authorities = authorityService.getAuthoritiesByNames(userRequestDTO.getAuthorities());
            dbUser.setAuthorities(authorities);
        }

        if (userRequestDTO.getPassword() != null) {
            dbUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }
        dbUser.setUpdateDate(LocalDate.now());

        return mapUserDTO(userRepository.save(dbUser));
    }

    @Transactional
    public String resetUser(UserRegistryDTO userRequestDTO) {
        String email = userRequestDTO.getEmail();
        String username = userRequestDTO.getUsername();

        userValidator.validateEmail(email);
        if (username == null || username.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }

        User dbUser = findUserByUsernameAndEmail(username, email);

        String password = UUID.randomUUID().toString().split("-")[0];
//        String password = "test";
        String hashedPassword = passwordEncoder.encode(password);
        dbUser.setPassword(hashedPassword);
        dbUser.setUpdateDate(LocalDate.now());

        return password;
    }


    @Transactional
    public void delete(String id) {
        User dbUser = findUserById(id);
        userRepository.delete(dbUser);
    }

    public UserResponseDTO mapUserDTO(User user) {
        UserResponseDTO userResponseDTO = userMapper.toDTO(user);
        cartMapper.toCartForUser(userResponseDTO, user.getCart(), productMapper);


        return userResponseDTO;
    }

    public List<UserResponseDTO> mapListUser(List<User> users) {
        return users.stream().map(this::mapUserDTO).toList();
    }
}
