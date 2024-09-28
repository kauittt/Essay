package com.mactiem.clothingstore.website.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mactiem.clothingstore.website.DTO.AuthorityDTO;
import com.mactiem.clothingstore.website.DTO.UserRegistryDTO;
import com.mactiem.clothingstore.website.DTO.UserResponseDTO;
import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.security.JWTGenerator;
import com.mactiem.clothingstore.website.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;
    @MockBean
    private AuthenticationManager authenticationManager;
    @MockBean
    private JWTGenerator jwtGenerator;

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

    //! REGISTER ----------------------------------------------------------------------------------------
    @Test
    public void testRegisterUser_whenValidRequest_returnUserResponseDTO() throws Exception {
        // Given
        Mockito.when(userService.createUser(eq(registry))).thenReturn(response);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registry)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("admin"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("admin@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("minh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phone").value("0937230092"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bảo Vinh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorities[0].authority").value("ROLE_USER"));

        Mockito.verify(userService, Mockito.times(1)).createUser(eq(registry));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testRegisterUser_whenBadRequest_returnBadRequest() throws Exception {
        // Given
        Mockito.when(userService.createUser(eq(badRegistry)))
                .thenThrow(new RuntimeException("Error registry user"));

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRegistry)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        Mockito.verify(userService, Mockito.times(1)).createUser(eq(badRegistry));
    }

    //! LOGIN ----------------------------------------------------------------------------------------
    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testLoginUser_whenValidCredentials_returnJwtResponse() throws Exception {
        //- GIVEN
        String jwt = "jwtToken";
        Authentication authentication = Mockito.mock(Authentication.class);

        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        Mockito.when(jwtGenerator.generateToken(authentication)).thenReturn(jwt);

        //- WHEN
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registry)))
                //- THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").value(jwt))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenType").value("Bearer"));

        Mockito.verify(authenticationManager, Mockito.times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        Mockito.verify(jwtGenerator, Mockito.times(1)).generateToken(authentication);
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testLogin_whenInvalidCredentials_returnBadRequest() throws Exception {
        //- GIVEN
        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        //- WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRegistry)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Invalid credentials"));

        Mockito.verify(authenticationManager, Mockito.times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    //! GET USERS ----------------------------------------------------------------------------------------
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetUsers_whenAdmin_returnListOfUsers() throws Exception {
        Mockito.when(userService.getAllUsers()).thenReturn(responseList);

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].username").value("admin"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].email").value("admin@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("minh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].phone").value("0937230092"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].address").value("Bảo Vinh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].authorities[0].authority").value("ROLE_USER"));

        Mockito.verify(userService, Mockito.times(1)).getAllUsers();
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetAllUsers_whenSuccess_returnEmptyUserList() throws Exception {
        //- GIVEN
        List<UserResponseDTO> userResponseDTOS = List.of();

        Mockito.when(userService.getAllUsers()).thenReturn(userResponseDTOS);

        //- WHEN
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users")
                        .contentType(MediaType.APPLICATION_JSON))
                //- THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));

        Mockito.verify(userService, Mockito.times(1)).getAllUsers();
    }

    //- ById
    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetUserById_whenSuccess_returnUser() throws Exception {
        //- GIVEN
        Mockito.when(userService.getUserById(eq(USER_ID))).thenReturn(response);

        //- WHEN
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/{id}", USER_ID)
                        .contentType(MediaType.APPLICATION_JSON))
                //- THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("admin"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("admin@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("minh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phone").value("0937230092"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bảo Vinh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorities[0].authority").value("ROLE_USER"));

        Mockito.verify(userService, Mockito.times(1)).getUserById(eq(USER_ID));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetUserById_whenUserNotFound_returnNotFound() throws Exception {
        //- GIVEN
        String nonExist = "non-existent-id";

        Mockito.when(userService.getUserById(eq(nonExist))).thenThrow(
                new RuntimeException(Response.notFound("User", nonExist)));

        //- WHEN
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/{id}", nonExist)
                        .contentType(MediaType.APPLICATION_JSON))
                //- THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());

        Mockito.verify(userService, Mockito.times(1)).getUserById(eq(nonExist));
    }

    //! UPDATE USER ----------------------------------------------------------------------------------------
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateUser_whenValidRequest_returnUpdatedUserResponseDTO() throws Exception {
        Mockito.when(userService.update(eq(USER_ID), eq(registry))).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders
                        .put("/users/{id}", USER_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registry)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("admin"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("admin@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("minh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phone").value("0937230092"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bảo Vinh"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorities[0].authority").value("ROLE_USER"));

        Mockito.verify(userService, Mockito.times(1)).update(eq(USER_ID), eq(registry));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateUser_whenBadRequest_returnBadRequest() throws Exception {
        // Given
        Mockito.when(userService.update(eq(USER_ID), eq(badRegistry)))
                .thenThrow(new RuntimeException("Error update user"));

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/users/{id}", USER_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRegistry)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        Mockito.verify(userService, Mockito.times(1)).update(eq(USER_ID), eq(badRegistry));
    }

    //! DELETE USER ----------------------------------------------------------------------------------------
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteUser_whenValidId_returnOk() throws Exception {
        Mockito.doNothing().when(userService).delete(USER_ID);

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/users/{id}", USER_ID))
                .andExpect(status().isOk());

        Mockito.verify(userService, Mockito.times(1)).delete(USER_ID);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteUser_whenInvalidId_returnNotFound() throws Exception {
        String invalidUserId = "invalid-id";
        Mockito.doThrow(new RuntimeException("User not found")).when(userService).delete(invalidUserId);

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/users/{id}", invalidUserId))
                .andExpect(status().isNotFound());

        Mockito.verify(userService, Mockito.times(1)).delete(invalidUserId);
    }
}
