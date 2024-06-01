package com.LinkShrink.urlservice.controller;


import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.filter.JwtAuthenticationFilter;
import com.LinkShrink.urlservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static com.LinkShrink.urlservice.constants.UrlPaths.API_V1_USERS;
import static com.LinkShrink.urlservice.constants.UrlPaths.ME;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtFilter;

    private UserResponse expectedUser;

    @BeforeEach
    public void setUp() {
        expectedUser = new UserResponse(123L, "username", "user@email.com", true);
    }

    @Test
    void getAuthenticatedUser() throws Exception {
        when(userService.getCurrentUser()).thenReturn(expectedUser);

        mockMvc.perform(get(API_V1_USERS + ME))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(123L))
                .andExpect(jsonPath("$.fullName").value("username"))
                .andExpect(jsonPath("$.email").value("user@email.com"))
                .andExpect(jsonPath("$.active").value(true));
    }
}
