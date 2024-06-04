package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

import static com.LinkShrink.urlservice.constants.SwaggerConstants.DESC_REDIRECT;
import static com.LinkShrink.urlservice.constants.SwaggerConstants.SUMMARY_REDIRECT;
import static com.LinkShrink.urlservice.constants.UrlPaths.SHORTCODE;

@Controller
public class RedirectController {
    private static final Logger log = LoggerFactory.getLogger(RedirectController.class);

    @Autowired
    private UrlService urlService;

    @GetMapping(SHORTCODE)
    @ResponseStatus(HttpStatus.FOUND)
    @Operation(summary = SUMMARY_REDIRECT, description = DESC_REDIRECT)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "401", description = "Invalid short code",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "404", description = "URL not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
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
