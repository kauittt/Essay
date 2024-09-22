package com.mactiem.clothingstore.website.service;


import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.*;
import com.mactiem.clothingstore.website.mapstruct.UserMapper;
import com.mactiem.clothingstore.website.repository.CartRepository;
import com.mactiem.clothingstore.website.repository.UserRepository;
import com.mactiem.clothingstore.website.validator.ProductValidator;
import com.mactiem.clothingstore.website.validator.UserValidator;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityService authorityService;
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final CartRepository cartRepository;

    @Autowired
    @Lazy
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, AuthorityService authorityService, UserValidator userValidator, CartRepository cartRepository) {
        this.authorityService = authorityService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userValidator = userValidator;
        this.cartRepository = cartRepository;
    }

    //- Helpers
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Named("byId")
    public User findUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("User", id)));
    }

    //- Methods
    public UserResponseDTO getUserById(String id) {
        User user = findUserById(id);
        return userMapper.toDTO(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toListDTOs(users);
    }

    @Transactional
    public UserResponseDTO createUser(UserRegistryDTO userRequestDTO) {
        userValidator.validateUserRegistration(userRequestDTO);

        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        userRequestDTO.setPassword(hashedPassword);

        //- Mapping
        User user = userMapper.toEntity(userRequestDTO, "create");
        Cart cart = new Cart(GenerateID.generateID(), user, new ArrayList<>());

        cartRepository.save(cart);
        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO update(String id, UserRegistryDTO userRequestDTO) {
        User dbUser = findUserById(id);

        userValidator.validateUpdate(userRequestDTO);

        Field[] fields = userRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("username") && !field.getName().equals("authorities") && !field.getName().equals("password")) {
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

        return userMapper.toDTO(userRepository.save(dbUser));
    }

    @Transactional
    public void delete(String id) {
        User dbUser = findUserById(id);
        userRepository.delete(dbUser);
    }
}
