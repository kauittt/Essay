package com.mactiem.clothingstore.website.controller;

import com.mactiem.clothingstore.website.DTO.JwtAuthResponse;
import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.UserMapper;
import com.mactiem.clothingstore.website.security.JWTGenerator;
import com.mactiem.clothingstore.website.security.SecurityUtils;
import com.mactiem.clothingstore.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;

    @Autowired
    @Lazy
    public UserController(UserService userService, AuthenticationManager authenticationManager, JWTGenerator jwtGenerator) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping(value = "/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistryDTO userRequestDTO) {
        try {
            UserResponseDTO savedUser = userService.createUser(userRequestDTO);
            return ResponseEntity.ok(savedUser);
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody UserRegistryDTO userRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userRequestDTO.getUsername(), userRequestDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);
            return ResponseEntity.ok(new JwtAuthResponse(token));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> userResponseDTOS = userService.getAllUsers();
        return ResponseEntity.ok(userResponseDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserRegistryDTO userRequestDTO) {
        try {
            return ResponseEntity.ok(userService.update(id, userRequestDTO));
        } catch (Exception e) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.delete(id);
            Response response = Response.of(HttpStatus.OK, "Deleted User Successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //* Current USer

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        try {
            return ResponseEntity.ok(userService.getCurrentUser());
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/current")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UserRegistryDTO userRequestDTO) {
        try {
            return ResponseEntity.ok(userService.updateCurrentUser(userRequestDTO));
        } catch (Exception e) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/reset")
    public ResponseEntity<?> resetUser(@RequestBody UserRegistryDTO userRequestDTO) {
        try {
            return ResponseEntity.ok(userService.resetUser(userRequestDTO));
        } catch (Exception e) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
