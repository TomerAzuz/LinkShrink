package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.view.RedirectView;

import static com.LinkShrink.urlservice.constants.UrlPaths.SHORTCODE;

@Controller
public class RedirectController {
    private static final Logger log = LoggerFactory.getLogger(RedirectController.class);

    @Autowired
    private UrlService urlService;

    @GetMapping(SHORTCODE)
    @ResponseStatus(HttpStatus.FOUND)
    public RedirectView redirect(@PathVariable("shortCode") String shortCode, HttpServletRequest request) {
        log.info("Redirect from short code: {}", shortCode);

        try {
            UrlMappingResponse response = urlService.redirect(shortCode, request);
            return new RedirectView(response.getLongUrl());
        } catch (UrlMappingNotFoundException e) {
            log.error("URL not found for short code: {}", shortCode);
            return new RedirectView("/error", true);
        }
    }
}
