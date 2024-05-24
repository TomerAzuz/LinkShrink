package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.RegistrationRequest;
import com.LinkShrink.urlservice.dto.AuthResponse;
import com.LinkShrink.urlservice.dto.LoginRequest;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.service.AuthenticationService;
import com.LinkShrink.urlservice.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final JwtService jwtService;

    private final AuthenticationService authService;

    public AuthController(JwtService jwtService, AuthenticationService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody RegistrationRequest registrationRequest) {
        logger.info("Signing up user {}", registrationRequest.getEmail());
        User registeredUser = authService.signup(registrationRequest);

        String jwtToken = jwtService.generateToken(registeredUser);

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwtToken)
                .expiresIn(jwtService.getExpirationTime())
                .fullName(registeredUser.getFullName())
                .email(registeredUser.getEmail())
                .build();

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest loginRequest) {
        logger.info("Authenticating user {}", loginRequest.getEmail());

        User authenticatedUser = authService.authenticate(loginRequest);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwtToken)
                .expiresIn(jwtService.getExpirationTime())
                .fullName(authenticatedUser.getFullName())
                .email(authenticatedUser.getEmail())
                .build();

        return ResponseEntity.ok(authResponse);
    }
}
