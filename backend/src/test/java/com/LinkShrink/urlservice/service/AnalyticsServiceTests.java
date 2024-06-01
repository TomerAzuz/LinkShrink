package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.AnalyticsRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTests {

    @InjectMocks
    private AnalyticsService analyticsService;

    @Mock
    private AnalyticsRepository analyticsRepository;

    @Mock
    private UserService userService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private RestTemplate restTemplate;


    @Test
    public void testSaveUrlAnalytics() {
        UrlMapping urlMapping = new UrlMapping();
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        analyticsService.saveUrlAnalytics(urlMapping, request);
        verify(analyticsRepository, times(1)).save(any(UrlAnalytics.class));
    }

    @Test
    public void testViewAnalyticsByNonExistingUrlId() {
        Long urlId = 1L;
        when(analyticsRepository.existsByUrlMappingId(urlId)).thenReturn(false);

        assertThrows(UrlMappingNotFoundException.class, () -> {
            analyticsService.viewAnalyticsByUrlId(urlId);
        });
    }

    @Test
    public void testViewAnalyticsByExistingUrlId() {
        Long urlId = 1L;
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1L);
        when(analyticsRepository.existsByUrlMappingId(urlId)).thenReturn(true);
        when(userService.getCurrentUser()).thenReturn(userResponse);

        List<UrlAnalytics> analyticsList = new ArrayList<>();
        when(analyticsRepository.findByUrlMappingIdAndUrlMapping_CreatedBy(urlId, 1L)).thenReturn(analyticsList);

        List<UrlAnalytics> result = analyticsService.viewAnalyticsByUrlId(urlId);

        assertNotNull(result);
        verify(analyticsRepository, times(1)).findByUrlMappingIdAndUrlMapping_CreatedBy(urlId, 1L);
    }

    @Test
    public void testViewAllAnalytics() {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1L);
        when(userService.getCurrentUser()).thenReturn(userResponse);

        List<UrlAnalytics> analyticsList = new ArrayList<>();
        when(analyticsRepository.findAllByUrlMapping_CreatedBy(1L)).thenReturn(analyticsList);

        List<UrlAnalytics> result = analyticsService.viewAllAnalytics();

        assertNotNull(result);
        verify(analyticsRepository, times(1)).findAllByUrlMapping_CreatedBy(1L);
    }
}
