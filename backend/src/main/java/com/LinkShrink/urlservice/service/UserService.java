package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        User user = (User) authentication.getPrincipal();

        return userMapper.userToUserResponse(user);
    }

    public List<UserResponse> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users
                .stream()
                .map(user -> userMapper.userToUserResponse(user))
                .toList();
    }
}
