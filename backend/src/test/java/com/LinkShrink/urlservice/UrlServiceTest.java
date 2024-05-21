package com.LinkShrink.urlservice;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.exception.InvalidUrlException;
import com.LinkShrink.urlservice.exception.ShortCodeNotFoundException;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.service.UrlService;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UrlServiceTest {

    @InjectMocks
    private UrlService urlService;

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private CustomUrlValidator customUrlValidator;

    @Value("${server.url}")
    private final String baseUrl = "http://localhost:9000";


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(urlService, "baseUrl", baseUrl);
    }

    @Test
    void testCreateUrlMappingValidUrl() {
        String longUrl = "https://www.example.com";
        Date expirationDate = new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000);

        when(customUrlValidator.isValid(longUrl)).thenReturn(true);
        when(urlRepository.existsByShortCode(anyString())).thenReturn(false);
        when(urlRepository.save(any(UrlMapping.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UrlMapping urlMapping = urlService.createUrlMapping(longUrl);

        assertNotNull(urlMapping);
        assertEquals(longUrl, urlMapping.getLongUrl());
        assertEquals(6, urlMapping.getShortCode().length());
        assertEquals(expirationDate.getTime() / 1000, urlMapping.getExpirationDate().getTime() / 1000);
    }

    @Test
    void testCreateUrlMappingInvalidUrl() {
        String longUrl = "invalid-url";

        when(customUrlValidator.isValid(longUrl)).thenReturn(false);

        assertThrows(InvalidUrlException.class, () -> urlService.createUrlMapping(longUrl));
    }

    @Test
    void testHandleRedirectionValidShortCode() {
        String shortCode = "abc123";
        String longUrl = "http://www.example.com";
        UrlMapping urlMapping = new UrlMapping(1L, longUrl, shortCode, null, 0L, new Date(), null);

        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.of(urlMapping));

        Optional<UrlMappingDTO> result = urlService.handleRedirection(shortCode);

        assertTrue(result.isPresent());
        assertEquals(longUrl, result.get().getLongUrl());
        assertEquals(baseUrl + "/" + shortCode, result.get().getShortUrl());
        assertEquals(1L, result.get().getNumClicks());
    }

    @Test
    void testHandleRedirectionInvalidShortCode() {
        String shortCode = "invalid";

        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.empty());

        assertThrows(ShortCodeNotFoundException.class, () -> urlService.handleRedirection(shortCode));
    }

    @Test
    void testIncrementClicksValidShortCode() {
        String shortCode = "abc123";
        UrlMapping urlMapping = new UrlMapping(1L, "http://www.example.com", shortCode, null, 0L, new Date(), null);

        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.of(urlMapping));
        when(urlRepository.save(any(UrlMapping.class))).thenAnswer(invocation -> invocation.getArgument(0));

        long clicks = urlService.incrementClicks(shortCode);

        assertEquals(1L, clicks);
        assertEquals(1L, urlMapping.getNumClicks());
    }

    @Test
    void testIncrementClicksInvalidShortCode() {
        String shortCode = "invalid";

        when(urlRepository.findByShortCode(shortCode)).thenReturn(Optional.empty());

        assertThrows(ShortCodeNotFoundException.class, () -> urlService.incrementClicks(shortCode));
    }

    @Test
    void testGenerateQRCodeImage() {
        String url = "http://example.com";

        when(urlRepository.save(any(UrlMapping.class))).thenAnswer(invocation -> invocation.<UrlMapping>getArgument(0));

        UrlMapping urlMapping = urlService.generateQRCodeImage(url);

        assertNotNull(urlMapping);
        assertNotNull(urlMapping.getQrCodeData());
        assertFalse(urlMapping.getQrCodeData().isEmpty());
    }
}
