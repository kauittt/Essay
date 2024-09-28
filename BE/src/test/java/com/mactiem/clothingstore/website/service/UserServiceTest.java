package com.mactiem.clothingstore.website.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Cart;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.UserMapper;
import com.mactiem.clothingstore.website.repository.CartRepository;
import com.mactiem.clothingstore.website.repository.UserRepository;
import com.mactiem.clothingstore.website.security.JWTGenerator;
import com.mactiem.clothingstore.website.validator.UserValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserServiceTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;
    @MockBean
    private UserMapper userMapper;
    @MockBean
    private UserValidator userValidator;
    @MockBean
    private PasswordEncoder passwordEncoder;
    @MockBean
    private CartRepository cartRepository;
    @MockBean
    private AuthorityService authorityService;

    private UserRegistryDTO registry;
    private UserRegistryDTO badRegistry;
    private UserResponseDTO response;
    private User user;
    private List<User> userList;
    private List<UserResponseDTO> responseList;
    private final String USER_ID = "1";

    @BeforeEach
    public void setup() {
        registry = new UserRegistryDTO();
        registry.setUsername("admin");
        registry.setPassword("admin");
        registry.setEmail("admin@gmail.com");
        registry.setName("minh");
        registry.setPhone("0937230092");
        registry.setAddress("Bảo Vinh");
        registry.setAuthorities(List.of("ROLE_USER"));

        badRegistry = new UserRegistryDTO();
        badRegistry.setUsername("admin");
        badRegistry.setEmail("admin@gmail.com");
        badRegistry.setName("minh");
        badRegistry.setPhone("0937230092");
        badRegistry.setAddress("Bảo Vinh");

        user = new User();
        user.setId("1");
        user.setUsername("admin");
        user.setPassword("admin");
        user.setEmail("admin@gmail.com");
        user.setName("minh");
        user.setPhone("0937230092");
        user.setAddress("Bảo Vinh");
        user.setAuthorities(List.of(new Authority("1", "ROLE_USER", new ArrayList<>())));

        response = new UserResponseDTO();
        response.setId("1");
        response.setUsername("admin");
        response.setEmail("admin@gmail.com");
        response.setName("minh");
        response.setPhone("0937230092");
        response.setAddress("Bảo Vinh");
        response.setAuthorities(List.of(new AuthorityDTO("1", "ROLE_USER")));

        userList = new ArrayList<>();
        userList.add(user);

        responseList = new ArrayList<>();
        responseList.add(response);
    }

    // --- Get All Users ---
    @Test
    public void testGetAllUsers_whenUsersExist_returnUserList() {
        // GIVEN
        Mockito.when(userRepository.findAll()).thenReturn(userList);
        Mockito.when(userMapper.toDTO(any(User.class))).thenReturn(response);

        // WHEN
        List<UserResponseDTO> result = userService.getAllUsers();

        // THEN
        assertEquals(responseList.size(), result.size());
        assertEquals("admin", result.get(0).getUsername());

        Mockito.verify(userRepository, Mockito.times(1)).findAll();
        Mockito.verify(userMapper, Mockito.times(1)).toDTO(any(User.class));
    }

    @Test
    public void testGetAllUsers_whenNoUsersExist_returnEmptyList() {
        // GIVEN
        List<User> emptyUserList = List.of();
        List<UserResponseDTO> emptyResponseList = List.of();

        Mockito.when(userRepository.findAll()).thenReturn(emptyUserList);

        // WHEN
        List<UserResponseDTO> result = userService.getAllUsers();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        Mockito.verify(userRepository, Mockito.times(1)).findAll();
    }

    // --- Get User By ID ---
    @Test
    public void testGetUserById_whenUserExists_returnUserResponseDTO() {
        // GIVEN
        Mockito.when(userRepository.findById(eq(USER_ID))).thenReturn(Optional.of(user));
        Mockito.when(userMapper.toDTO(any(User.class))).thenReturn(response);

        // WHEN
        UserResponseDTO result = userService.getUserById(USER_ID);

        // THEN
        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        assertEquals("admin@gmail.com", result.getEmail());

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(USER_ID));
        Mockito.verify(userMapper, Mockito.times(1)).toDTO(any(User.class));
    }

    @Test
    public void testGetUserById_whenUserDoesNotExist_throwException() {
        // GIVEN
        String nonExistentId = "error";

        Mockito.when(userRepository.findById(eq(nonExistentId))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.getUserById(nonExistentId)
        );

        assertEquals(Response.notFound("User", nonExistentId)
                , exception.getMessage());

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(nonExistentId));
    }

    // --- Create User ---
    @Test
    public void testCreateUser_whenValidData_thenUserIsCreated() {
        // GIVEN
        Mockito.doNothing().when(userValidator).validateUserRegistration(eq(registry));

        Mockito.when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        Mockito.when(userMapper.toEntity(eq(registry))).thenReturn(user);
        Mockito.when(cartRepository.save(any())).thenReturn(new Cart());
        Mockito.when(userRepository.save(eq(user))).thenReturn(user);
        Mockito.when(userMapper.toDTO(any(User.class))).thenReturn(response);

        // WHEN
        UserResponseDTO result = userService.createUser(registry);

        // THEN
        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        assertEquals("admin@gmail.com", result.getEmail());

        Mockito.verify(userValidator, Mockito.times(1)).validateUserRegistration(eq(registry));
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(anyString());
        Mockito.verify(userMapper, Mockito.times(1)).toEntity(eq(registry));
        Mockito.verify(cartRepository, Mockito.times(1)).save(any());
        Mockito.verify(userRepository, Mockito.times(1)).save(eq(user));
        Mockito.verify(userMapper, Mockito.times(1)).toDTO(any(User.class));
    }

    @Test
    public void testCreateUser_whenInvalidData_thenThrowException() {
        // GIVEN
        Mockito.doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required"))
                .when(userValidator).validateUserRegistration(eq(badRegistry));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userService.createUser(badRegistry)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Password is required", exception.getReason());

        Mockito.verify(userValidator, Mockito.times(1)).validateUserRegistration(eq(badRegistry));
        Mockito.verify(userMapper, Mockito.never()).toEntity(any());
        Mockito.verify(userRepository, Mockito.never()).save(any());
    }

    // --- Update User ---
    @Test
    public void testUpdateUser_whenValidData_thenUserIsUpdated() {
        // GIVEN
        Mockito.when(userRepository.findById(eq(USER_ID))).thenReturn(Optional.of(user));
        Mockito.doNothing().when(userValidator).validateUpdate(eq(registry));
        Mockito.when(authorityService.getAuthoritiesByNames(eq(registry.getAuthorities())))
                .thenReturn(List.of(new Authority("1", "ROLE_USER", new ArrayList<>())));
        Mockito.when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        Mockito.when(userRepository.save(eq(user))).thenReturn(user);
        Mockito.when(userMapper.toDTO(any(User.class))).thenReturn(response);


        // WHEN
        UserResponseDTO result = userService.update(USER_ID, registry);

        // THEN
        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        assertEquals("admin@gmail.com", result.getEmail());

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(USER_ID));
        Mockito.verify(userValidator, Mockito.times(1)).validateUpdate(eq(registry));
        Mockito.verify(authorityService).getAuthoritiesByNames(eq(registry.getAuthorities()));
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(anyString());
        Mockito.verify(userRepository, Mockito.times(1)).save(eq(user));
        Mockito.verify(userMapper, Mockito.times(1)).toDTO(any(User.class));


    }

    @Test
    public void testUpdateUser_whenUserDoesNotExist_thenThrowException() {
        // GIVEN
        String nonExistentId = "999";

        Mockito.when(userRepository.findById(eq(nonExistentId))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.update(nonExistentId, registry)
        );

        assertEquals(Response.notFound("User", nonExistentId), exception.getMessage()); // Adjust based on Response.notFound implementation

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(nonExistentId));
        Mockito.verify(userValidator, Mockito.never()).validateUpdate(any());
        Mockito.verify(userRepository, Mockito.never()).save(any());
    }

    @Test
    public void testUpdateUser_whenInvalidData_thenThrowException() {
        // GIVEN
        Mockito.when(userRepository.findById(eq(USER_ID))).thenReturn(Optional.of(user));
        Mockito.doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid registry format"))
                .when(userValidator).validateUpdate(eq(badRegistry));

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userService.update(USER_ID, badRegistry)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Invalid registry format", exception.getReason());

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(USER_ID));
        Mockito.verify(userValidator, Mockito.times(1)).validateUpdate(eq(badRegistry));
        Mockito.verify(userRepository, Mockito.never()).save(any());
    }

    // --- Delete User ---
    @Test
    public void testDeleteUser_whenUserExists_thenUserIsDeleted() {
        // GIVEN
        Mockito.when(userRepository.findById(eq(USER_ID))).thenReturn(Optional.of(user));

        // WHEN
        userService.delete(USER_ID);

        // THEN
        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(USER_ID));
        Mockito.verify(userRepository, Mockito.times(1)).delete(eq(user));
    }

    @Test
    public void testDeleteUser_whenUserDoesNotExist_thenThrowException() {
        // GIVEN
        String nonExistentId = "999";

        Mockito.when(userRepository.findById(eq(nonExistentId))).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.delete(nonExistentId)
        );

        assertEquals(Response.notFound("User", nonExistentId), exception.getMessage());

        Mockito.verify(userRepository, Mockito.times(1)).findById(eq(nonExistentId));
        Mockito.verify(userRepository, Mockito.never()).delete(any());
    }
}
