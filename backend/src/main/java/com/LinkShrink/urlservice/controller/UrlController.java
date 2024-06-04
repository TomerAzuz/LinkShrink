package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.dto.UrlDto;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.LinkShrink.urlservice.constants.SwaggerConstants.*;
import static com.LinkShrink.urlservice.constants.UrlPaths.*;

@RestController
@RequestMapping(API_V1_URL)
@Validated
public class UrlController {

    private static final Logger log = LoggerFactory.getLogger(UrlController.class);
    @Value("${server.url}")
    private String baseUrl;

    @Autowired
    private UrlService urlService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserMapper userMapper;

    @PostMapping(SHORTEN)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = SUMMARY_SHORTEN, description = DESC_SHORTEN)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400", description = "Invalid URL format",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public UrlMappingResponse shortenUrl(@Valid @RequestBody UrlDto request) {
        String longUrl = request.getUrl();
        log.info("Shortening URL: {}", longUrl);

        return urlService.createUrlMapping(longUrl);
    }

    @GetMapping(MY_LINKS)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_MYLINKS, description = DESC_MYLINKS)
    public Iterable<UrlMappingResponse> getUrlMappings(@RequestParam(name = "page", defaultValue = "0") int page) {
        log.info("Getting all url mappings for page {}", page);

        Pageable pageable = PageRequest.of(page, 10);
        return urlService.viewAllUrlMappings(pageable);
    }

    @DeleteMapping(URL_ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = SUMMARY_DELETE_URL, description = DESC_DELETE_URL)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "404", description = "URL not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public void deleteUrlMapping(@PathVariable("urlId") Long urlId) {
        log.info("Removing url mapping with id {}", urlId);
        urlService.deleteUrlMapping(urlId);
    }

    @PostMapping(REPORT)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = SUMMARY_REPORT, description = DESC_REPORT)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400", description = "Invalid URL format",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "404", description = "URL not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public void reportMaliciousUrl(@Valid @RequestBody UrlDto urlDTO) throws MessagingException {
        String url = urlDTO.getUrl();
        log.info("{} reported as malicious", url);
        urlService.handleMaliciousUrl(url);
    }

    @PostMapping(UNSHORTEN)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_UNSHORTEN, description = DESC_UNSHORTEN)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400", description = "Invalid URL format",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public UrlDto unshortenUrl(@Valid @RequestBody UrlDto urlDTO) {
        String url = urlDTO.getUrl();
        return urlService.unshortenUrl(url);
    }
}
