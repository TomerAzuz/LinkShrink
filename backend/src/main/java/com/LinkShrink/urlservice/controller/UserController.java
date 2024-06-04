package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.LinkShrink.urlservice.constants.SwaggerConstants.*;
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
    @Operation(summary = SUMMARY_USERS_ME, description = DESC_USERS_ME)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public UserResponse authenticatedUser() {
        log.info("Getting authenticated user");
        return userService.getCurrentUser();
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_USERS_ALL, description = DESC_USERS_ALL)
    public List<UserResponse> allUsers() {
        log.info("Getting all users");
        return userService.allUsers();
    }
}
