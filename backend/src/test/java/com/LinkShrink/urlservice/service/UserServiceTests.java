package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Test
    void testGetCurrentUser() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@email.com");

        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserResponse expectedResponse = new UserResponse();
        expectedResponse.setId(1L);
        expectedResponse.setEmail("user@email.com");

        when(userMapper.userToUserResponse(mockUser)).thenReturn(expectedResponse);

        UserResponse actualResponse = userService.getCurrentUser();

        assertEquals(expectedResponse, actualResponse);
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
}
