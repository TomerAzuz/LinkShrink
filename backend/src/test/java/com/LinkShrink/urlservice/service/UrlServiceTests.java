package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UrlDto;
import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.event.UrlAccessedEvent;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidShortCodeException;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidUrlException;
import com.LinkShrink.urlservice.mapper.UrlMapper;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import com.LinkShrink.urlservice.validator.ShortCodeValidator;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;
import org.testcontainers.shaded.com.google.common.collect.Iterables;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UrlServiceTests {
    @InjectMocks
    private UrlService urlService;

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private UrlMapper urlMapper;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private CustomUrlValidator customUrlValidator;

    @Mock
    private ShortCodeValidator shortCodeValidator;

    @BeforeEach
    public void setUp() {
        ReflectionTestUtils.setField(urlService, "baseUrl", "http://localhost:9000");
    }

    @Test
    public void testCreateUrlMappingInvalidUrl() {
        String invalidUrl = "invalid-url";
        when(customUrlValidator.isValid(invalidUrl)).thenReturn(false);

        assertThrows(InvalidUrlException.class, () ->
                urlService.createUrlMapping(invalidUrl));
    }

    @Test
    public void testCreateUrlMappingValidUrl() {
        String validUrl = "http://example.com";
        when(customUrlValidator.isValid(validUrl))
                .thenReturn(true);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(1L);

        when(userService.getCurrentUser())
                .thenReturn(userResponse);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl(validUrl);
        urlMapping.setCreatedBy(1L);

        when(urlRepository.save(any(UrlMapping.class)))
                .thenReturn(urlMapping);
        when(urlMapper.urlMappingToUrlMappingResponse(any(UrlMapping.class)))
                .thenReturn(new UrlMappingResponse());

        UrlMappingResponse response = urlService.createUrlMapping(validUrl);

        assertNotNull(response);
        verify(urlRepository, times(1)).save(any(UrlMapping.class));
    }

    @Test
    public void testViewAllUrlMappings() {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1L);
        when(userService.getCurrentUser()).thenReturn(userResponse);

        List<UrlMapping> urlMappings = Arrays.asList(new UrlMapping(), new UrlMapping());
        Page<UrlMapping> page = new PageImpl<>(urlMappings);

        Pageable pageable = PageRequest.of(0, 10);

        when(urlRepository.findAllByCreatedBy(eq(1L), eq(pageable))).thenReturn(page);

        when(urlMapper.urlMappingToUrlMappingResponse(any(UrlMapping.class))).thenReturn(new UrlMappingResponse());

        Iterable<UrlMappingResponse> response = urlService.viewAllUrlMappings(pageable);

        assertEquals(2, Iterables.size(response));
        verify(userService, times(1)).getCurrentUser();
        verify(urlRepository, times(1)).findAllByCreatedBy(eq(1L), eq(pageable));
        verify(urlMapper, times(2)).urlMappingToUrlMappingResponse(any(UrlMapping.class));
    }

    @Test
    public void testRedirectInvalidShortCode() {
        String shortCode = "invalid";
        when(shortCodeValidator.isValidShortCode(shortCode)).thenReturn(false);

        assertThrows(InvalidShortCodeException.class, () ->
                urlService.redirect(shortCode, mock(HttpServletRequest.class)));
    }

    @Test
    public void testRedirectValidShortCode() {
        String shortCode = "abc123";
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(shortCodeValidator.isValidShortCode(shortCode)).thenReturn(true);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setShortCode(shortCode);
        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.of(urlMapping));
        when(urlMapper.urlMappingToUrlMappingResponse(any(UrlMapping.class))).thenReturn(new UrlMappingResponse());

        UrlMappingResponse response = urlService.redirect(shortCode, request);

        assertNotNull(response);
        verify(eventPublisher, times(1)).publishEvent(any(UrlAccessedEvent.class));
    }

    @Test
    public void testGenerateQRCodeImage() {
        String longUrl = "http://example.com";
        String qrCodeImage = urlService.generateQRCodeImage(longUrl);

        assertNotNull(qrCodeImage);
        assertFalse(qrCodeImage.isEmpty());
    }

    @Test
    public void testHandleMaliciousUrl() throws MessagingException {
        String maliciousUrl = "http://localhost:9000/abc123";

        when(customUrlValidator.isValid(maliciousUrl))
                .thenReturn(true);

        when(urlRepository.existsByShortCode(anyString()))
                .thenReturn(true);

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail("user@example.com");
        when(userService.getCurrentUser()).thenReturn(userResponse);

        urlService.handleMaliciousUrl(maliciousUrl);

        verify(emailService, times(1)).sendSimpleMessage(eq(null), eq("Malicious URL reported"), anyString());
    }

    @Test
    public void testUnshortenUrl() {
        String shortUrl = "http://localhost:9000/abc123";
        String shortCode = "abc123";
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl("http://example.com");

        when(customUrlValidator.isValid(shortUrl))
                .thenReturn(true);

        when(urlRepository.findByShortCode(shortCode))
                .thenReturn(Optional.of(urlMapping));

        UrlDto urlDto = urlService.unshortenUrl(shortUrl);

        assertNotNull(urlDto);
        assertEquals("http://example.com", urlDto.getUrl());
    }
}
