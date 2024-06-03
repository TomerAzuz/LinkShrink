package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.filter.JwtAuthenticationFilter;
import com.LinkShrink.urlservice.service.AuthenticationService;
import com.LinkShrink.urlservice.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import static com.LinkShrink.urlservice.constants.UrlPaths.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AuthenticationService authService;
    @MockBean
    private JwtAuthenticationFilter jwtFilter;
    @MockBean
    private EmailService emailService;
    private RegistrationRequest registrationRequest;
    private PasswordResetRequest passwordResetRequest;
    private LoginRequest loginRequest;
    private String userEmail;
    private String username;


    @BeforeEach
    public void setUp() {
        String password = "password";
        userEmail = "user@email.com";
        username = "username";

        registrationRequest = RegistrationRequest.builder()
        .email(userEmail)
        .password(password)
        .confirmPassword(password)
        .build();

        loginRequest = LoginRequest.builder()
                .email(userEmail)
                .password(password)
                .build();

        passwordResetRequest = PasswordResetRequest.builder()
                .email(userEmail)
                .password(password)
                .confirmPassword(password)
                .build();
    }

    private UserResponse createUserResponse(boolean isActive) {
        return new UserResponse(
                1L,
                username,
                userEmail,
                isActive
        );
    }

    @Test
    void testRegister() throws Exception {
        UserResponse userResponse = createUserResponse(false);

        when(authService.signup(any(RegistrationRequest.class)))
                .thenReturn(userResponse);

        mockMvc.perform(post(API_V1_AUTH + SIGNUP)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value(username))
                .andExpect(jsonPath("$.active").value(false))
                .andExpect(jsonPath("$.email").value(userEmail));
    }

    @Test
    public void testLogin() throws Exception {
        UserResponse userResponse = createUserResponse(true);
        String token = "Bearer jwtToken";
        String refreshToken = "Bearer jwtRefreshToken";
        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .expiresIn(3600L)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();

        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(authResponse);

        mockMvc.perform(post(API_V1_AUTH + LOGIN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.refreshToken").value(refreshToken))
                .andExpect(jsonPath("$.expiresIn").value(3600))
                .andExpect(jsonPath("$.user.fullName").value(username))
                .andExpect(jsonPath("$.user.active").value(true))
                .andExpect(jsonPath("$.user.email").value(userEmail));
    }

    @Test
    void testActivateAccount() throws Exception {
        UserResponse userResponse = createUserResponse(true);
        String activationCode = "code123";
        when(authService.activateUser(activationCode)).thenReturn(userResponse);

        mockMvc.perform(get(API_V1_AUTH + "/activate/" + activationCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value(username))
                .andExpect(jsonPath("$.email").value(userEmail))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    void testForgotPassword() throws Exception {
        doNothing().when(authService).sendPasswordResetCode(userEmail);

        mockMvc.perform(get(API_V1_AUTH + "/forgot/" + userEmail))
                .andExpect(status().isOk());
    }

    @Test
    void testVerifyResetCode() throws Exception {
        Mockito.doNothing().when(authService).getEmailByResetCode("resetCode");

        String resetCode = "resetCode1233";
        mockMvc.perform(get(API_V1_AUTH + "/verify/" + resetCode))
                .andExpect(status().isOk());
    }

    @Test
    void testRefreshToken() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest("Bearer validRefreshToken");

        String token = "Bearer newJwtToken";
        String refreshToken = "Bearer jwtRefreshToken";
        long expirationTime = 3600;
        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .expiresIn(expirationTime)
                .refreshToken(refreshToken)
                .build();

        when(authService.refreshToken(any(RefreshTokenRequest.class)))
                .thenReturn(authResponse);

        mockMvc.perform(post(API_V1_AUTH + REFRESH_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.expiresIn").value(expirationTime))
                .andExpect(jsonPath("$.refreshToken").value(refreshToken));
    }

    @Test
    void testResetPassword() throws Exception {
        Mockito.doNothing().when(authService).resetPassword(eq(userEmail), eq("newPassword"), eq("newPassword"));

        mockMvc.perform(post(API_V1_AUTH + RESET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(passwordResetRequest)))
                .andExpect(status().isOk());
    }
}
