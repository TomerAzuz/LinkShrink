package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.LinkShrink.urlservice.constants.SwaggerConstants.*;
import static com.LinkShrink.urlservice.constants.UrlPaths.*;

@RestController
@RequestMapping(API_V1_AUTH)
public class AuthController {
    private static final Logger logger = LoggerFactory
            .getLogger(AuthController.class);
    @Autowired
    private AuthenticationService authService;

    @PostMapping(SIGNUP)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_SIGNUP, description = DESC_SIGNUP)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400", description = "Passwords do not match.",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "409", description = "Email already exists.",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public UserResponse register(@Valid @RequestBody RegistrationRequest registrationRequest)
            throws MessagingException {
        logger.info("Signing up user {}", registrationRequest.getEmail());
        return authService.signup(registrationRequest);
    }

    @PostMapping(LOGIN)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_AUTH, description = DESC_AUTH)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "403", description = "Activation required",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public AuthResponse authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Authenticating user {}", loginRequest.getEmail());
        return authService.authenticate(loginRequest);
    }

    @PostMapping(REFRESH_TOKEN)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_REFRESH, description = DESC_REFRESH)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Invalid token",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public AuthResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        logger.info("Refreshing token");
        return authService.refreshToken(refreshTokenRequest);
    }

    @GetMapping(ACTIVATE_CODE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_ACTIVATE, description = DESC_ACTIVATE)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Invalid activation code",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public UserResponse activateAccount(@PathVariable("code") String code) {
        logger.info("Activating account");
        return authService.activateUser(code);
    }

    @GetMapping(FORGOT_EMAIL)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_FORGOT, description = DESC_FORGOT)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "500", description = "Email not sent",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public void forgotPassword(@PathVariable("email") String email) throws MessagingException {
        logger.info("Sending password reset code to {}", email);
        authService.sendPasswordResetCode(email);
    }

    @GetMapping(VERIFY_CODE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_VERIFY, description = DESC_VERIFY)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Invalid reset code",
                        content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public void verifyResetCode(@PathVariable("code") String code) {
        logger.info("Verifying reset code");
        authService.getEmailByResetCode(code);
    }

    @PostMapping(RESET)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_RESET, description = DESC_RESET)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400", description = "Passwords do not match",
                        content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "401", description = "User not found",
                        content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public void resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        logger.info("Resetting password for user {}", request.getEmail());
        authService.resetPassword(request.getEmail(), request.getPassword(), request.getConfirmPassword());
    }
}
