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
    private UserService userService;

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
        verify(userService, times(1)).saveUser(any(User.class));
        verify(emailService, times(1)).sendSimpleMessage(eq(registrationRequest.getEmail()), anyString(), anyString());
    }
    
    @Test
    public void testSignupPasswordMismatch() {
        registrationRequest.setConfirmPassword("differentPassword");

        assertThrows(PasswordConfirmationException.class, () ->
                authenticationService.signup(registrationRequest));

        verify(userService, never()).saveUser(any(User.class));
    }

    @Test
    public void testAuthenticationSuccess() {
        when(userService.findByEmail(anyString()))
                .thenReturn(user);
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
        when(userService.findByEmail(anyString()))
                .thenThrow(new UsernameNotFoundException("User not found"));

        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");

        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(loginRequest);
        });

        verify(authenticationManager, times(1)).authenticate(
                argThat(argument -> argument instanceof UsernamePasswordAuthenticationToken &&
                        (argument).getPrincipal().equals(loginRequest.getEmail()) &&
                        (argument).getCredentials().equals(loginRequest.getPassword()))
        );
    }

    @Test
    public void testAuthenticationInvalidPassword() {
        doThrow(BadCredentialsException.class).when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () ->
                authenticationService.authenticate(loginRequest));

        verify(userService, never()).findByEmail(anyString());
    }

    @Test
    public void testActivateUserSuccess() {
        when(userService.findByActivationCode(anyString())).thenReturn(user);
        when(userMapper.userToUserResponse(any(User.class))).thenReturn(new UserResponse());

        UserResponse response = authenticationService.activateUser(user.getActivationCode());

        assertNotNull(response);
        assertTrue(user.isActive());
        assertNull(user.getActivationCode());
        verify(userService, times(1)).saveUser(user);
    }

    @Test
    public void testSendPasswordResetCodeSuccess() throws MessagingException {
        when(userService.findByEmail(anyString())).thenReturn(user);

        authenticationService.sendPasswordResetCode(user.getEmail());

        assertNotNull(user.getResetCode());
        verify(userService, times(1)).saveUser(user);
        verify(emailService, times(1)).sendSimpleMessage(eq(user.getEmail()), anyString(), anyString());
    }

    @Test
    public void testGetEmailByResetCodeSuccess() {
        user.setResetCode("reset-code");

        when(userService.findByResetCode("reset-code"))
                .thenReturn((user));

        authenticationService.getEmailByResetCode(user.getResetCode());

        assertTrue(user.isResetCodeVerified());

        verify(userService, times(1)).saveUser(user);
    }

    @Test
    public void testResetPasswordSuccess() {
        user.setResetCodeVerified(true);
        when(userService.findByEmail(anyString()))
                .thenReturn(user);
        when(passwordEncoder.encode(anyString()))
                .thenReturn("newEncodedPassword");

        authenticationService.resetPassword(
                user.getEmail(),
                "newPassword",
                "newPassword");

        assertEquals("newEncodedPassword", user.getPassword());
        assertNull(user.getResetCode());
        assertFalse(user.isResetCodeVerified());
        verify(userService, times(1)).saveUser(user);
    }

    @Test
    public void testResetPasswordPasswordMismatch() {
        assertThrows(PasswordConfirmationException.class, () ->
                authenticationService.resetPassword(
                        user.getEmail(),
                        "newPassword",
                        "differentPassword"));

        verify(userService, never()).saveUser(any(User.class));
    }

    @Test
    public void testResetPasswordResetCodeNotVerified() {
        when(userService.findByEmail(anyString())).thenReturn(user);

        assertThrows(InvalidCodeException.class, () ->
                authenticationService.resetPassword(
                        user.getEmail(),
                        "newPassword",
                        "newPassword"));

        verify(userService, never()).saveUser(any(User.class));
    }
}
