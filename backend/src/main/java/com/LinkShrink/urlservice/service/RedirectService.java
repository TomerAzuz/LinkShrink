package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.event.UrlAccessedEvent;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidShortCodeException;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.mapper.UrlMapper;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.ShortCodeValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class RedirectService {

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private UrlMapper urlMapper;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private ShortCodeValidator shortCodeValidator;

    public UrlMappingResponse redirect(String shortCode, HttpServletRequest request) {
        if (!shortCodeValidator.isValidShortCode(shortCode)) {
            throw new InvalidShortCodeException("Invalid short code");
        }

        UrlMapping urlMapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlMappingNotFoundException("URL not found"));

        eventPublisher.publishEvent(new UrlAccessedEvent(urlMapping, request));
        return urlMapper.urlMappingToUrlMappingResponse(urlMapping);
    }
}
