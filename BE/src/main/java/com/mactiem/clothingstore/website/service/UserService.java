package com.mactiem.clothingstore.website.service;


import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.UserMapper;
import com.mactiem.clothingstore.website.repository.UserRepository;
import com.mactiem.clothingstore.website.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityService authorityService;
    private final UserRepository userRepository;
    private final UserValidator userValidator;
//    private final CartService cartService;
//    private final OrderService orderService;

    @Autowired
    public UserService( UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, AuthorityService authorityService, UserValidator userValidator) {
        this.authorityService = authorityService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userValidator = userValidator;
    }

    //- Helpers
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

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
        userValidator.validateRequiredFields(userRequestDTO);
        userValidator.validateUniqueUsername(userRequestDTO);
        userValidator.validateAuthoritiesExistence(userRequestDTO.getAuthorities());
//-     userValidator.validatePasswordStrength(userRequestDTO.getPassword());

        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        userRequestDTO.setPassword(hashedPassword);

        //- Mapping
        User user = userMapper.toEntity(userRequestDTO, "create");


        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO update(String id, UserRegistryDTO userRequestDTO) {
        if (userRequestDTO.getAuthorities() != null) {
            userValidator.validateAuthoritiesExistence(userRequestDTO.getAuthorities());
        }

        User dbUser = findUserById(id);

        Field[] fields = userRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                if (!field.getName().equals("username") && !field.getName().equals("authorities")) {
                    Object value = field.get(userRequestDTO);
                    if (value != null) {
                        Field dbField = User.class.getDeclaredField(field.getName());
                        dbField.setAccessible(true);
                        dbField.set(dbUser, value);
                    }
                }
            }

            if (userRequestDTO.getAuthorities() != null) {
                List<Authority> authorities = authorityService.getAuthoritiesByNames(userRequestDTO.getAuthorities());
                dbUser.setAuthorities(authorities);
            }

        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        return userMapper.toDTO(userRepository.save(dbUser));
    }

    @Transactional
    public void delete(String id) {
        User dbUser = findUserById(id);
        userRepository.delete(dbUser);
    }
}
