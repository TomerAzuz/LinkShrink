package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@Controller
public class RedirectController {
    private static final Logger log = LoggerFactory.getLogger(RedirectController.class);

    @Autowired
    private UrlService urlService;

    @GetMapping("{shortCode}")
    public RedirectView redirectUrl(@PathVariable("shortCode") String shortCode, HttpServletRequest request) {
        log.info("Redirect from short code: {}", shortCode);

        Optional<UrlMappingDTO> urlMappingDTO = urlService.handleRedirection(shortCode, request);

        return urlMappingDTO.map(mappingDTO -> new RedirectView(mappingDTO.getLongUrl()))
                .orElseGet(() -> new RedirectView("/", true));
    }
}
