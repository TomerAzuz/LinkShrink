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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

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


    @Test
    public void testCreateUrlMappingInvalidUrl() {
        String invalidUrl = "invalid-url";
        when(customUrlValidator.isValid(invalidUrl)).thenReturn(false);

        assertThrows(InvalidUrlException.class, () -> {
            urlService.createUrlMapping(invalidUrl);
        });
    }

    @Test
    public void testCreateUrlMappingValidUrl() {
        String validUrl = "http://example.com";
        when(customUrlValidator.isValid(validUrl)).thenReturn(true);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(1L);
        when(userService.getCurrentUser()).thenReturn(userResponse);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl(validUrl);
        urlMapping.setCreatedBy(1L);
        when(urlRepository.save(any(UrlMapping.class))).thenReturn(urlMapping);
        when(urlMapper.urlMappingToUrlMappingResponse(any(UrlMapping.class))).thenReturn(new UrlMappingResponse());

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
        when(urlRepository.findAllByCreatedBy(1L)).thenReturn(urlMappings);
        when(urlMapper.urlMappingToUrlMappingResponse(any(UrlMapping.class))).thenReturn(new UrlMappingResponse());

        List<UrlMappingResponse> responses = urlService.viewAllUrlMappings();

        assertEquals(2, responses.size());
        verify(urlRepository, times(1)).findAllByCreatedBy(1L);
    }

    @Test
    public void testRedirectInvalidShortCode() {
        String shortCode = "invalid";
        when(shortCodeValidator.isValidShortCode(shortCode)).thenReturn(false);

        assertThrows(InvalidShortCodeException.class, () -> {
            urlService.redirect(shortCode, mock(HttpServletRequest.class));
        });
    }

    @Test
    public void testRedirectValidShortCode() {
        String shortCode = "abc123";
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(shortCodeValidator.isValidShortCode(shortCode)).thenReturn(true);
        when(urlRepository.existsByShortCode(shortCode)).thenReturn(true);

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
        String maliciousUrl = "http://malicious.com";
        when(urlRepository.existsByLongUrl(maliciousUrl)).thenReturn(true);

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail("user@example.com");
        when(userService.getCurrentUser()).thenReturn(userResponse);

        urlService.handleMaliciousUrl(maliciousUrl);

        verify(emailService, times(1)).sendSimpleMessage(eq(null), eq("Malicious URL reported"), anyString());
    }

    @Test
    public void testUnshortenUrl() {
        String shortUrl = "http://localhost/abc123";
        String shortCode = "abc123";
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl("http://example.com");

        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.of(urlMapping));

        UrlDto urlDto = urlService.unshortenUrl(shortUrl);

        assertNotNull(urlDto);
        assertEquals("http://example.com", urlDto.getUrl());
    }
}
