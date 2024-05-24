package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.AuthResponse;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/v1/users")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> authenticatedUser() {
        User currentUser = userService.getCurrentUser();
        AuthResponse authResponse = AuthResponse.builder()
                                    .email(currentUser.getEmail())
                                    .fullName(currentUser.getFullName())
                                    .build();
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping
    public ResponseEntity<List<AuthResponse>> allUsers() {
        List<User> users = userService.allUsers();
        List<AuthResponse> userList = users.
                stream()
                .map(user -> AuthResponse.builder()
                                        .fullName(user.getFullName())
                                        .email(user.getEmail()).build()).toList();
        return ResponseEntity.ok(userList);
    }
}
