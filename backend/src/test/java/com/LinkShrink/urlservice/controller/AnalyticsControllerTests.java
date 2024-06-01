package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.filter.JwtAuthenticationFilter;
import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.service.AnalyticsService;
import com.LinkShrink.urlservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static com.LinkShrink.urlservice.constants.UrlPaths.API_V1_ANALYTICS;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AnalyticsController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AnalyticsControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtFilter;


    @Test
    void testGetAnalyticsByUrlId() throws Exception {
        Long urlId = 123L;
        List<UrlAnalytics> expectedAnalytics = new ArrayList<>();
        when(analyticsService.viewAnalyticsByUrlId(urlId))
                .thenReturn(expectedAnalytics);

        mockMvc.perform(get(API_V1_ANALYTICS, urlId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetAllAnalytics() throws Exception {
        List<UrlAnalytics> expectedAnalytics = new ArrayList<>();
        when(analyticsService.viewAllAnalytics()).thenReturn(expectedAnalytics);

        mockMvc.perform(get(API_V1_ANALYTICS))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }
}
