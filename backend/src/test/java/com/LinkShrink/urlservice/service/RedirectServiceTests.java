package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.event.UrlAccessedEvent;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidShortCodeException;
import com.LinkShrink.urlservice.mapper.UrlMapper;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.ShortCodeValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class RedirectServiceTests {

    @InjectMocks
    private RedirectService redirectService;

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private UrlMapper urlMapper;

    @Mock
    private ShortCodeValidator shortCodeValidator;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Test
    public void testRedirectInvalidShortCode() {
        String shortCode = "invalid";
        when(shortCodeValidator.isValidShortCode(shortCode)).thenReturn(false);

        assertThrows(InvalidShortCodeException.class, () ->
                redirectService.redirect(shortCode, mock(HttpServletRequest.class)));
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

        UrlMappingResponse response = redirectService.redirect(shortCode, request);

        assertNotNull(response);
        verify(eventPublisher, times(1)).publishEvent(any(UrlAccessedEvent.class));
    }
}
