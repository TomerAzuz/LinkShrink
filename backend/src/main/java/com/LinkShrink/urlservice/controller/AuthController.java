package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.LinkShrink.urlservice.constants.UrlPaths.*;

@RestController
@RequestMapping(API_V1_AUTH)
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationService authService;

    @PostMapping(SIGNUP)
    @ResponseStatus(HttpStatus.OK)
    public UserResponse register(@Valid @RequestBody RegistrationRequest registrationRequest) throws MessagingException {
        logger.info("Signing up user {}", registrationRequest.getEmail());
        return authService.signup(registrationRequest);
    }

    @PostMapping(LOGIN)
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Authenticating user {}", loginRequest.getEmail());
        return authService.authenticate(loginRequest);
    }

    @GetMapping(ACTIVATE_CODE)
    @ResponseStatus(HttpStatus.OK)
    public UserResponse activateAccount(@PathVariable("code") String code) {
        logger.info("Activating account");
        return authService.activateUser(code);
    }

    @GetMapping(FORGOT_EMAIL)
    @ResponseStatus(HttpStatus.OK)
    public void forgotPassword(@PathVariable("email") String email) throws MessagingException {
        logger.info("Sending password reset code to {}", email);
        authService.sendPasswordResetCode(email);
    }

    @GetMapping(VERIFY_CODE)
    @ResponseStatus(HttpStatus.OK)
    public void verifyResetCode(@PathVariable("code") String code) {
        logger.info("Verifying reset code");
        authService.getEmailByResetCode(code);
    }

    @PostMapping(RESET)
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@Valid @RequestBody PasswordResetRequest request) throws Exception {
        logger.info("Resetting password for user {}", request.getEmail());
        authService.resetPassword(request.getEmail(), request.getPassword(), request.getConfirmPassword());
    }
}
