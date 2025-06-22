package com.project.foodie;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import com.project.foodie.database.User;
import com.project.foodie.database.UserController;
import com.project.foodie.database.UserRepository;
import com.project.foodie.database.VerificationTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class InjectionTest {

    private UserService userService;
    private UserRepository userRepository;
    private VerificationTokenRepository tokenRepository;
    private UserController userController;

    @BeforeEach
    public void setUp() {
        userService = mock(UserService.class);
        userRepository = mock(UserRepository.class);
        tokenRepository = mock(VerificationTokenRepository.class);
        userController = new UserController(userService, userRepository, tokenRepository);
    }

    @Test
    public void testLogin_SQLInjectionAttempt() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "'; DROP TABLE users; --");
        loginRequest.put("password", "anyPassword");

        when(userService.loginUser(anyString(), anyString()))
                .thenReturn(new ResultMessage("User with email \"'; DROP TABLE users; --\" not found", false));

        ResponseEntity<ResultMessage> response = userController.login(loginRequest);

        assertEquals(401, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("not found"));
    }
    @Test
    public void testRegister_SQLInjectionAttemptInUsername() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("admin'; DROP DATABASE foodie; --");
        user.setPassword("StrongP@ssw0rd");

        ResultMessage failResult = new ResultMessage("User with username admin'; DROP DATABASE foodie; -- already exists", false);

        when(userService.registerUser(any(User.class))).thenReturn(failResult);

        ResponseEntity<ResultMessage> response = userController.register(user);

        assertEquals(400, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
    }


}

