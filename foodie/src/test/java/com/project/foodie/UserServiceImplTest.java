package com.project.foodie;

import com.project.foodie.administration.EmailService;
import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.implementation.UserServiceImplementation;
import com.project.foodie.database.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;


import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private DailyGoalRepository goalRepository;

    @InjectMocks
    private UserServiceImplementation userServiceImplementation;

    @Test
    public void testThatGeneratesDailyGoalAndSavesUser(){
        Date date = new Date();
        User user = User.builder()
                .id(1)
                .email("test@gmail.com")
                .username("Test")
                .password("hardPass!1")
                .isActive(Boolean.FALSE)
                .registrationDate(date)
                .activationDate(null)
                .build();

        UserEntity savedUserEntity = UserEntity.builder()
                .id(1)
                .email("test@gmail.com")
                .username("Test")
                .password("hardPass!1")
                .isActive(Boolean.FALSE)
                .registrationDate(date)
                .activationDate(null)
                .build();

        when(userRepository.save(any(UserEntity.class))).thenReturn(savedUserEntity);

        User result = userServiceImplementation.createUser(user);

        assertNotNull(result);
        assertEquals("test@gmail.com", result.getEmail());
        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(goalRepository, times(1)).save(any(DailyGoalEntity.class));
    }

    @Test
    public void testRegisterUserWithExistingEmail() {
        User user = User.builder()
                .email("existing@test.com")
                .username("testuser")
                .password("Pass!123")
                .build();

        when(userRepository.findByEmail("existing@test.com")).thenReturn(Optional.of(new UserEntity()));

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("already exists"));
    }

    @Test
    public void testRegisterUserWithExistingUsername() {
        User user = User.builder()
                .email("new@test.com")
                .username("existingUser")
                .password("Pass!123")
                .build();

        when(userRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("existingUser")).thenReturn(Optional.of(new UserEntity()));

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("username"));
    }

    @Test
    public void testRegisterUserWithShortPassword() {
        User user = User.builder()
                .email("shortpass@test.com")
                .username("user")
                .password("Short1!")
                .build();

        when(userRepository.findByEmail("shortpass@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("at least 8 characters"));
    }

    @Test
    public void testRegisterUserWithNoDigitInPassword() {
        User user = User.builder()
                .email("nodigit@test.com")
                .username("user")
                .password("Password!")
                .build();

        when(userRepository.findByEmail("nodigit@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("at least one digit"));
    }

    @Test
    public void testRegisterUserWithNoLetterInPassword() {
        User user = User.builder()
                .email("noletter@test.com")
                .username("user")
                .password("1234567!")
                .build();

        when(userRepository.findByEmail("noletter@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("at least one letter"));
    }

    @Test
    public void testRegisterUserWithNoSpecialCharInPassword() {
        User user = User.builder()
                .email("nospecial@test.com")
                .username("user")
                .password("Password1")
                .build();

        when(userRepository.findByEmail("nospecial@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("at least one special character"));
    }

    @Test
    public void testRegisterUserSuccessfully() {
        User user = User.builder()
                .email("newuser@test.com")
                .username("newuser")
                .password("Pass!123")
                .build();

        UserEntity savedEntity = UserEntity.builder()
                .id(1)
                .email("newuser@test.com")
                .username("newuser")
                .password("encrypted")
                .isActive(false)
                .registrationDate(new Date())
                .build();

        when(userRepository.findByEmail("newuser@test.com"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(savedEntity));
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(UserEntity.class))).thenReturn(savedEntity);

        ResultMessage result = userServiceImplementation.registerUser(user);

        assertTrue(result.getSuccess());
        assertTrue(result.getMessage().contains("please check your email"));

        verify(tokenRepository).save(any(VerificationTokenEntity.class));
        verify(emailService).sendVerificationEmail(eq("newuser@test.com"), anyString());
    }

    @Test
    public void testLoginUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        ResultMessage result = userServiceImplementation.loginUser("unknown@test.com", "anyPass");

        assertFalse(result.getSuccess());
        assertTrue(result.getMessage().contains("not found"));
    }

    @Test
    public void testLoginUserIncorrectPassword() {
        String hashed = BCrypt.hashpw("Correct!1", BCrypt.gensalt());
        UserEntity userEntity = UserEntity.builder()
                .email("user@test.com")
                .password(hashed)
                .isActive(true)
                .build();

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(userEntity));

        ResultMessage result = userServiceImplementation.loginUser("user@test.com", "WrongPass!1");

        assertFalse(result.getSuccess());
        assertEquals("Incorrect password.", result.getMessage());
    }

    @Test
    public void testLoginUserNotActivated() {
        String hashed = BCrypt.hashpw("Pass!123", BCrypt.gensalt());
        UserEntity userEntity = UserEntity.builder()
                .email("inactive@test.com")
                .password(hashed)
                .isActive(false)
                .build();

        when(userRepository.findByEmail("inactive@test.com")).thenReturn(Optional.of(userEntity));

        ResultMessage result = userServiceImplementation.loginUser("inactive@test.com", "Pass!123");

        assertFalse(result.getSuccess());
        assertEquals("Account is not activated.", result.getMessage());
    }

    @Test
    public void testLoginUserSuccess() {
        String password = "Pass!123";
        String hashed = BCrypt.hashpw(password, BCrypt.gensalt());
        UserEntity userEntity = UserEntity.builder()
                .email("active@test.com")
                .password(hashed)
                .isActive(true)
                .build();

        when(userRepository.findByEmail("active@test.com")).thenReturn(Optional.of(userEntity));

        ResultMessage result = userServiceImplementation.loginUser("active@test.com", password);

        assertTrue(result.getSuccess());
        assertEquals("Login successful.", result.getMessage());
    }

    @Test
    public void testGetUserIdByEmailFound() {
        UserEntity userEntity = UserEntity.builder()
                .id(42)
                .email("findme@test.com")
                .build();

        when(userRepository.findByEmail("findme@test.com")).thenReturn(Optional.of(userEntity));

        Integer id = userServiceImplementation.getUserIdByEmail("findme@test.com");

        assertEquals(42, id);
    }

    @Test
    public void testGetUserIdByEmailNotFound() {
        when(userRepository.findByEmail("missing@test.com")).thenReturn(Optional.empty());

        Integer id = userServiceImplementation.getUserIdByEmail("missing@test.com");

        assertNull(id);
    }


}
