package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.constants.EmailTemplates;
import com.LinkShrink.urlservice.dto.*;
import com.LinkShrink.urlservice.enums.Role;
import com.LinkShrink.urlservice.exception.AuthExceptions.EmailExistsException;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.AuthExceptions.PasswordConfirmationException;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
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

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
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

        userRepository.save(user);

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

    public AuthResponse authenticate(LoginRequest userDto) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDto.getEmail(),
                            userDto.getPassword()));

            User user = userRepository.findByEmail(userDto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!user.isActive()) {
                throw new UsernameNotFoundException("Activation required");
            }

            Claims claims = Jwts.claims().setSubject(user.getUsername());
            claims.put("role", Role.USER);

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
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

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
        User user = userRepository.findByActivationCode(code)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setActivationCode(null);
        user.setActive(true);
        userRepository.save(user);

        return userMapper.userToUserResponse(user);
    }

    @Transactional
    public void sendPasswordResetCode(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String resetCode = UUID.randomUUID().toString();
        user.setResetCode(resetCode);
        userRepository.save(user);

        String emailContent = String.format(
                EmailTemplates.PASSWORD_RESET_TEMPLATE,
                user.getFullName(),
                resetCode);

        emailService.sendSimpleMessage(email, "LinkShrink - Password Reset", emailContent);
    }

    @Transactional
    public void getEmailByResetCode(String code) {
        User user = userRepository.findByResetCode(code)
                .orElseThrow(() -> new InvalidCodeException("Invalid reset code"));

        user.setResetCodeVerified(true);
        userRepository.save(user);
    }

    private boolean passwordsMatch(String password, String password2) {
        return password != null && password.equals(password2);
    }

    @Transactional
    public void resetPassword(String email, String password, String password2) {
        if (!passwordsMatch(password, password2)) {
            throw new PasswordConfirmationException("Passwords do not match");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isResetCodeVerified()) {
            throw new InvalidCodeException("Reset code not verified");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setResetCode(null);
        user.setResetCodeVerified(false);
        userRepository.save(user);
    }
}
