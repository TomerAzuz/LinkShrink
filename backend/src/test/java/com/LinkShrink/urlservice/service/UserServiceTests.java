package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.AuthExceptions.UserNotAuthenticatedException;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testGetCurrentUser() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@email.com");

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        UserResponse expectedResponse = new UserResponse();
        expectedResponse.setId(1L);
        expectedResponse.setEmail("user@email.com");

        when(userMapper.userToUserResponse(mockUser)).thenReturn(expectedResponse);

        UserResponse actualResponse = userService.getCurrentUser();

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void testGetCurrentUserNotAuthenticated() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThrows(UserNotAuthenticatedException.class, () -> userService.getCurrentUser());
    }

    @Test
    void testAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("user1@email.com");

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@email.com");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        UserResponse userResponse1 = new UserResponse();
        userResponse1.setId(1L);
        userResponse1.setEmail("user1@email.com");

        UserResponse userResponse2 = new UserResponse();
        userResponse2.setId(2L);
        userResponse2.setEmail("user2@email.com");

        when(userMapper.userToUserResponse(user1)).thenReturn(userResponse1);
        when(userMapper.userToUserResponse(user2)).thenReturn(userResponse2);

        List<UserResponse> expectedResponses = Arrays.asList(userResponse1, userResponse2);
        List<UserResponse> actualResponses = userService.allUsers();

        assertEquals(expectedResponses, actualResponses);
    }

    @Test
    void testAllUsersNoUsersFound() {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        List<UserResponse> actualResponses = userService.allUsers();

        assertEquals(0, actualResponses.size());
    }

    @Test
    void testGetCurrentUserPrincipalNotUser() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new Object());

        assertThrows(ClassCastException.class, () -> userService.getCurrentUser());
    }

    @Test
    public void testActivateUserInvalidCode() {
        when(userRepository.findByActivationCode(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(InvalidCodeException.class, () ->
                userService.findByActivationCode("invalidCode"));
    }

    @Test
    public void testFindByInvalidResetCode() {
        when(userRepository.findByResetCode(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(InvalidCodeException.class, () ->
                userService.findByResetCode("invalidCode"));
    }
}
