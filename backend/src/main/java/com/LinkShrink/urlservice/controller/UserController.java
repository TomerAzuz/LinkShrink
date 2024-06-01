package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.LinkShrink.urlservice.constants.UrlPaths.API_V1_USERS;
import static com.LinkShrink.urlservice.constants.UrlPaths.ME;

@RequestMapping(API_V1_USERS)
@RestController
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @GetMapping(ME)
    @ResponseStatus(HttpStatus.OK)
    public UserResponse authenticatedUser() {
        log.info("Getting authenticated user");
        return userService.getCurrentUser();
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponse> allUsers() {
        log.info("Getting all users");
        return userService.allUsers();
    }
}
