package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.AuthResponse;
import com.LinkShrink.urlservice.dto.LoginRequest;
import com.LinkShrink.urlservice.dto.RegistrationRequest;
import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.enums.Role;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.AuthExceptions.PasswordConfirmationException;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTests {

    @InjectMocks
    private AuthenticationService authenticationService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    @Mock
    private UserMapper userMapper;

    @MockBean
    private CustomUrlValidator customUrlValidator;
    private RegistrationRequest registrationRequest;

    private LoginRequest loginRequest;

    private User user;

    @BeforeEach
    public void setUp() {
        registrationRequest = new RegistrationRequest();
        registrationRequest.setFullName("Test User");
        registrationRequest.setEmail("user@example.com");
        registrationRequest.setPassword("password");
        registrationRequest.setConfirmPassword("password");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("password");

        user = User.builder()
                .fullName("Test User")
                .email("user@email.com")
                .password("encodedPassword")
                .roles(Collections.singleton(Role.USER))
                .isActive(false)
                .activationCode(UUID.randomUUID().toString())
                .build();
    }

    @Test
    public void testSignupSuccess() throws MessagingException {
        when(passwordEncoder.encode(anyString()))
                .thenReturn("encodedPassword");
        when(userMapper.userToUserResponse(any(User.class)))
                .thenReturn(new UserResponse());

        UserResponse userResponse = authenticationService.signup(registrationRequest);

        assertNotNull(userResponse);
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendSimpleMessage(eq(registrationRequest.getEmail()), anyString(), anyString());
    }
    
    @Test
    public void testSignupPasswordMismatch() {
        registrationRequest.setConfirmPassword("differentPassword");

        assertThrows(PasswordConfirmationException.class, () ->
                authenticationService.signup(registrationRequest));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testAuthenticationSuccess() {
        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(Claims.class), any(User.class)))
                .thenReturn("Bearer jwtToken");
        when(userMapper.userToUserResponse(any(User.class)))
                .thenReturn(new UserResponse());

        user.setActive(true);
        AuthResponse response = authenticationService.authenticate(loginRequest);

        assertNotNull(response);
        assertEquals("Bearer jwtToken", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testAuthenticationUserNotFound() {
        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(loginRequest);
        });

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testAuthenticationInvalidPassword() {
        doThrow(BadCredentialsException.class).when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () ->
                authenticationService.authenticate(loginRequest));

        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    public void testActivateUserSuccess() {
        when(userRepository.findByActivationCode(anyString())).thenReturn(Optional.of(user));
        when(userMapper.userToUserResponse(any(User.class))).thenReturn(new UserResponse());

        UserResponse response = authenticationService.activateUser(user.getActivationCode());

        assertNotNull(response);
        assertTrue(user.isActive());
        assertNull(user.getActivationCode());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testActivateUserInvalidCode() {
        when(userRepository.findByActivationCode(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                authenticationService.activateUser("invalidCode"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testSendPasswordResetCodeSuccess() throws MessagingException {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        authenticationService.sendPasswordResetCode(user.getEmail());

        assertNotNull(user.getResetCode());
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendSimpleMessage(eq(user.getEmail()), anyString(), anyString());
    }

    @Test
    public void testSendPasswordResetCodeUserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                authenticationService.sendPasswordResetCode("nonexistent@example.com"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testGetEmailByResetCodeSuccess() {
        user.setResetCode("reset-code");

        when(userRepository.findByResetCode("reset-code"))
                .thenReturn(Optional.of(user));

        authenticationService.getEmailByResetCode(user.getResetCode());

        assertTrue(user.isResetCodeVerified());

        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testGetEmailByResetCodeInvalidCode() {
        when(userRepository.findByResetCode(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(InvalidCodeException.class, () ->
                authenticationService.getEmailByResetCode("invalidCode"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testResetPasswordSuccess() {
        user.setResetCodeVerified(true);
        when(userRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString()))
                .thenReturn("newEncodedPassword");

        authenticationService.resetPassword(
                user.getEmail(),
                "newPassword",
                "newPassword");

        assertEquals("newEncodedPassword", user.getPassword());
        assertNull(user.getResetCode());
        assertFalse(user.isResetCodeVerified());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testResetPasswordPasswordMismatch() {
        assertThrows(PasswordConfirmationException.class, () ->
                authenticationService.resetPassword(
                        user.getEmail(),
                        "newPassword",
                        "differentPassword"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testResetPasswordUserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                authenticationService.resetPassword(
                        "nonexistent@example.com",
                        "newPassword",
                        "newPassword"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testResetPasswordResetCodeNotVerified() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(InvalidCodeException.class, () ->
                authenticationService.resetPassword(
                        user.getEmail(),
                        "newPassword",
                        "newPassword"));

        verify(userRepository, never()).save(any(User.class));
    }
}
