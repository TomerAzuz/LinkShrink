package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.constants.templates.EmailTemplates;
import com.LinkShrink.urlservice.dto.RegistrationRequest;
import com.LinkShrink.urlservice.dto.LoginRequest;
import com.LinkShrink.urlservice.enums.Role;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private EmailService emailService;

    @Transactional
    public User signup(RegistrationRequest request) throws MessagingException {
        String pwd = request.getPassword();
        String pwd2 = request.getConfirmPassword();

        if (!passwordsMatch(pwd, pwd2)) {
            throw new IllegalArgumentException("Invalid password");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));
        user.setResetCodeVerified(false);
        user.setActive(false);
        String activationCode = UUID.randomUUID().toString();
        user.setActivationCode(activationCode);

        userRepository.save(user);

        String emailContent = String.format(EmailTemplates.ACCOUNT_ACTIVATION_TEMPLATE, user.getFullName(), activationCode);
        emailService.sendSimpleMessage(request.getEmail(), "LinkShrink - Activation Code", emailContent);
        return user;
    }

    public User authenticate(LoginRequest userDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDto.getEmail(),
                        userDto.getPassword()
                )
        );

         User user = userRepository.findByEmail(userDto.getEmail())
                 .orElseThrow(() -> new UsernameNotFoundException("User not found"));

         if (!user.isActive()) {
             throw new UsernameNotFoundException("Activation required");
         }
         return user;
    }

    @Transactional
    public User activateUser(String code) {
        User user = userRepository.findByActivationCode(code)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setActivationCode(null);
        user.setActive(true);
        return userRepository.save(user);
    }

    @Transactional
    public void sendPasswordResetCode(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String resetCode = UUID.randomUUID().toString();
        user.setResetCode(resetCode);
        userRepository.save(user);

        String emailContent = String.format(EmailTemplates.PASSWORD_RESET_TEMPLATE, user.getFullName(), resetCode);
        emailService.sendSimpleMessage(email, "LinkShrink - Password Reset", emailContent);
    }

    @Transactional
    public void getEmailByResetCode(String code) {
        User user = userRepository.findByResetCode(code)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid reset code"));

        user.setResetCodeVerified(true);
        userRepository.save(user);
    }

    private boolean passwordsMatch(String password, String password2) {
        return password != null && password.equals(password2);
    }

    @Transactional
    public void resetPassword(String email, String password, String password2) throws Exception {
        if (!passwordsMatch(password, password2)) {
            throw new Exception("Passwords do not match");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isResetCodeVerified()) {
            throw new Exception("Reset code not verified");
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setResetCode(null);
        user.setResetCodeVerified(false);
        userRepository.save(user);
    }
}
