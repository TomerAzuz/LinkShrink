package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.enums.Role;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.service.AuthenticationService;
import com.LinkShrink.urlservice.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegistrationRequest registrationRequest) throws MessagingException {
        logger.info("Signing up user {}", registrationRequest.getEmail());
        User user = authService.signup(registrationRequest);
        UserResponse userResponse = new UserResponse(
                user.getFullName(),
                user.getEmail(),
                user.isActive());

        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Authenticating user {}", loginRequest.getEmail());

        User authenticatedUser = authService.authenticate(loginRequest);

        Claims claims = Jwts.claims().setSubject(authenticatedUser.getUsername());
        claims.put("role", Role.USER);
        String jwtToken = jwtService.generateToken(claims, authenticatedUser);

        UserResponse userResponse = new UserResponse(
                authenticatedUser.getFullName(),
                authenticatedUser.getEmail(),
                authenticatedUser.isActive());

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwtToken)
                .expiresIn(jwtService.getExpirationTime())
                .user(userResponse)
                .build();

        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/activate/{code}")
    public ResponseEntity<UserResponse> activateAccount(@PathVariable("code") String code) {
        logger.info("Activating account");
        User user = authService.activateUser(code);
        UserResponse userResponse = new UserResponse(user.getFullName(), user.getEmail(), user.isActive());

        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/forgot/{email}")
    public ResponseEntity<Void> forgotPassword(@PathVariable("email") String email) throws MessagingException {
        logger.info("Sending password reset code to {}", email);
        authService.sendPasswordResetCode(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<Void> verifyResetCode(@PathVariable("code") String code) {
        logger.info("Verifying reset code");
        authService.getEmailByResetCode(code);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordResetRequest request) throws Exception {
        logger.info("Resetting password for user {}", request.getEmail());
        authService.resetPassword(request.getEmail(), request.getPassword(), request.getConfirmPassword());
        return ResponseEntity.ok().build();
    }
}
