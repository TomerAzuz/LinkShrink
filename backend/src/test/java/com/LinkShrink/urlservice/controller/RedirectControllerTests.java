package com.LinkShrink.urlservice.controller;

import static org.mockito.Mockito.*;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.service.UrlService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.view.RedirectView;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RedirectControllerTests {

    @Mock
    private UrlService urlService;

    @InjectMocks
    private RedirectController redirectController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSuccessfulRedirection() {
        String shortCode = "abc123";
        String longUrl = "http://example.com";
        UrlMappingResponse response = UrlMappingResponse
                .builder()
                .longUrl(longUrl)
                .build();
        MockHttpServletRequest request = new MockHttpServletRequest();
        when(urlService.redirect(shortCode, request)).thenReturn(response);

        RedirectView redirectView = redirectController.redirect(shortCode, request);

        assertEquals(longUrl, redirectView.getUrl());
        verify(urlService, times(1)).redirect(shortCode, request);
    }

    @Test
    void testShortCodeNotFound() {
        String shortCode = "notfound";
        MockHttpServletRequest request = new MockHttpServletRequest();
        when(urlService.redirect(shortCode, request)).thenThrow(new UrlMappingNotFoundException("URL not found"));

        RedirectView redirectView = redirectController.redirect(shortCode, request);

        assertEquals("/", redirectView.getUrl());
        verify(urlService, times(1)).redirect(shortCode, request);
    }
}