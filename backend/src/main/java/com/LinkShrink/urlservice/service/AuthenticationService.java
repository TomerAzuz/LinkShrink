package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.constants.EmailTemplates;
import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.enums.Role;
import com.LinkShrink.urlservice.exception.AuthExceptions.EmailExistsException;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.AuthExceptions.PasswordConfirmationException;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
public class AuthenticationService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserMapper userMapper;

    @Transactional
    public UserResponse signup(RegistrationRequest request) throws MessagingException {
        String pwd = request.getPassword();
        String pwd2 = request.getConfirmPassword();

        if (!passwordsMatch(pwd, pwd2)) {
            throw new PasswordConfirmationException("Passwords do not match");
        }

        if (userService.existsByEmail(request.getEmail())) {
            throw new EmailExistsException("Email already exists");
        }

        String activationCode = UUID.randomUUID().toString();

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(Role.USER))
                .resetCodeVerified(false)
                .isActive(false)
                .activationCode(activationCode)
                .build();

        userService.saveUser(user);

        // Send activation code
        String emailContent = String.format(
                EmailTemplates.ACCOUNT_ACTIVATION_TEMPLATE,
                user.getFullName(),
                activationCode
        );
        emailService.sendSimpleMessage(
                request.getEmail(),
                "LinkShrink - Activation Code",
                emailContent);

        return userMapper.userToUserResponse(user);
    }

    public AuthResponse authenticate(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            User user = userService.findByEmail(loginRequest.getEmail());

            if (!user.isActive()) {
                throw new DisabledException("Activation required");
            }

            Claims claims = Jwts.claims().setSubject(user.getUsername());
            String role = user.getRoles().iterator().next().name();
            claims.put("role", role);

            String jwtToken = jwtService.generateToken(claims, user);
            String refreshToken = jwtService.generateRefreshToken(user);
            UserResponse userResponse = userMapper.userToUserResponse(user);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtService.getExpirationTime())
                    .user(userResponse)
                    .build();
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        UserDetails userDetails = jwtService.getUserDetailsFromToken(refreshToken);
        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            User user = userService.findByEmail(userDetails.getUsername());

            String jwtToken = jwtService.generateToken(user);
            return AuthResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtService.getExpirationTime())
                    .user(userMapper.userToUserResponse(user))
                    .build();
        } else {
            throw new InvalidBearerTokenException("Invalid refresh token");
        }
    }

    @Transactional
    public UserResponse activateUser(String code) {
        User user = userService.findByActivationCode(code);

        user.setActivationCode(null);
        user.setActive(true);
        userService.saveUser(user);

        return userMapper.userToUserResponse(user);
    }

    @Transactional
    public void sendPasswordResetCode(String email) throws MessagingException {
        User user = userService.findByEmail(email);

        String resetCode = UUID.randomUUID().toString();
        user.setResetCode(resetCode);
        userService.saveUser(user);

        String emailContent = String.format(
                EmailTemplates.PASSWORD_RESET_TEMPLATE,
                user.getFullName(),
                resetCode);

        emailService.sendSimpleMessage(email, "LinkShrink - Password Reset", emailContent);
    }

    @Transactional
    public void getEmailByResetCode(String code) {
        User user = userService.findByResetCode(code);

        user.setResetCodeVerified(true);
        userService.saveUser(user);
    }

    private boolean passwordsMatch(String password, String password2) {
        return password != null && password.equals(password2);
    }

    @Transactional
    public void resetPassword(String email, String password, String password2) {
        if (!passwordsMatch(password, password2)) {
            throw new PasswordConfirmationException("Passwords do not match");
        }

        User user = userService.findByEmail(email);

        if (!user.isResetCodeVerified()) {
            throw new InvalidCodeException("Reset code not verified");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setResetCode(null);
        user.setResetCodeVerified(false);
        userService.saveUser(user);
    }
}
