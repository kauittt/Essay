package com.mactiem.clothingstore.website.service;


import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Cart;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.repository.AuthorityRepository;
import com.mactiem.clothingstore.website.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityRepository authorityRepository;
//    private final UserMapper userMapper = UserMapper.INSTANCE;
//    private final AuthorityMapper authorityMapper = AuthorityMapper.INSTANCE;
//    private final CartService cartService;
//    private final OrderService orderService;

    @Autowired
    public UserService(AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


//    public UserService(AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CartService cartService, OrderService orderService) {
//        this.authorityRepository = authorityRepository;
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.cartService = cartService;
//        this.orderService = orderService;
//    }

    @Transactional
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    private User findUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Response.notFound("User", id)));
    }

//    public List<UserResponseDTO> getAllUsers() {
//        return userRepository.findAll().stream().map(userMapper::toUserResponseDTOFull).toList();
//    }
//
//    public UserResponseDTO getUserById(String id) {
//        return userMapper.toUserResponseDTOFull(findUserById(id));
//    }

//    @Transactional
//    public UserResponseDTO deleteUser(String id) {
//        User user = findUserById(id);
//
//        //- Cart
//        cartService.deleteCart(String.valueOf(user.getId()));
//        user.setCart(null);
//
//        //- Authority
//        for(Authority authority : user.getAuthorities()) {
//            authority.getUsers().remove(user);
//        }
//        user.getAuthorities().clear();
//
//        //- Orders
//        for(Order order : user.getOrders()) {
//            orderService.deleteOrder(String.valueOf(order.getId()));
//        }
//        user.getOrders().clear();
//
//        userRepository.delete(user);
//        return userMapper.toUserResponseDTO(user);
//    }
//
//    @Transactional
//    public UserResponseDTO updateUser(String id, UserResponseDTO userResponseDTO) {
//        User user = findUserById(id);
//
//        user.setDateUpdate(LocalDateTime.now());
//
//        if (userResponseDTO.getEmail() != null) {
//            user.setEmail(userResponseDTO.getEmail());
//        }
//        if (userResponseDTO.getName() != null) {
//            user.setName(userResponseDTO.getName());
//        }
//        if (userResponseDTO.getPhone() != null) {
//            user.setPhone(userResponseDTO.getPhone());
//        }
//        if (userResponseDTO.getAddress() != null) {
//            user.setAddress(userResponseDTO.getAddress());
//        }
//        if (userResponseDTO.getAuthorities() != null) {
//            // Step 1: Convert the incoming list of AuthorityDTO to a list of Authority entities
//            List<Authority> updatedAuthorities = userResponseDTO.getAuthorities().stream()
//                    .map(dto -> authorityRepository.findById(String.valueOf(dto.getId()))
//                            .orElseThrow(() -> new RuntimeException("Authority not found with ID: " + dto.getId())))
//                    .toList();
//
//            // Step 2: Remove authorities that are no longer associated with the user
//            List<Authority> authoritiesToRemove = user.getAuthorities().stream()
//                    .filter(auth -> !updatedAuthorities.contains(auth))
//                    .toList();
//
//            for (Authority authority : authoritiesToRemove) {
//                authority.getUsers().remove(user); // Remove the user from the authority's list of users
//                user.getAuthorities().remove(authority); // Remove the authority from the user's list of authorities
//            }
//
//            // Step 3: Add new authorities to the user
//            for (Authority authority : updatedAuthorities) {
//                if (!user.getAuthorities().contains(authority)) {
//                    user.getAuthorities().add(authority);
//                    authority.getUsers().add(user);
//                }
//            }
//        }
//
//        // Save the user with updated authorities
//        return userMapper.toUserResponseDTOFull(userRepository.save(user));
//    }
//
//    @Transactional
//    public UserResponseDTO createUser(UserRegistryDTO userRegistryDTO) {
//        String hashedPassword = passwordEncoder.encode(userRegistryDTO.getPassword());
//        userRegistryDTO.setPassword(hashedPassword);
//        User user = userMapper.toEnity(userRegistryDTO);
//        user.setDateCreate(LocalDateTime.now());
//        user.setDateUpdate(LocalDateTime.now());
//        user.setEnabled(1);
////        user.setEmail("template@gmail.com");
//        user.setName("New user");
//        user.setPhone("xxxxxxxxxx");
//        user.setAddress("Template address");
//
//        Authority userAuthority = authorityRepository.findById("1")
//                .orElseThrow(() -> new RuntimeException(Response.notFound("Authority", "1")));
//        user.setAuthorities(Collections.singletonList(userAuthority));
//        userAuthority.getUsers().add(user);
//
//        // Tạo giỏ hàng mới cho user
//        Cart cart = new Cart();
//        cart.setUser(user);
//        user.setCart(cart);
//
//        user.setOrders(new ArrayList<>());
//
//        return userMapper.toUserResponseDTOFull(userRepository.save(user));
//    }


}
