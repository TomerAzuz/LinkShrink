package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.dto.UrlRequest;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/url")
@Validated
public class UrlController {

    private static final Logger log = LoggerFactory.getLogger(UrlController.class);

    @Value("${server.url}")
    private String baseUrl;

    @Autowired
    private UrlService urlService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/shorten")
    public ResponseEntity<UrlMappingDTO> shortenUrl(@Valid @RequestBody UrlRequest request) {
        String longUrl = request.getLongUrl();
        log.info("Shortening URL: {}", longUrl);
        UrlMapping savedMapping = urlService.createUrlMapping(longUrl);
        UrlMappingDTO dto = new UrlMappingDTO(savedMapping.getLongUrl(),
                                       baseUrl + "/" + savedMapping.getShortCode(),
                                              null,
                                              savedMapping.getNumClicks());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/my-links")
    public ResponseEntity<List<UrlMappingDTO>> getUrlMappings() {
        log.info("Getting all url mappings");
        List<UrlMapping> urlMappings = urlService.getAllUrlMappings();
        List<UrlMappingDTO> urlMappingDTOS = urlMappings
                .stream()
                .map(url -> new UrlMappingDTO(url.getLongUrl(),
                        baseUrl + "/" + url.getShortCode(),
                        url.getQrCodeData(),
                        url.getNumClicks())).toList();
        return ResponseEntity.ok(urlMappingDTOS);
    }

    @GetMapping("{shortCode}")
    public ResponseEntity<UrlMappingDTO> redirectUrl(@PathVariable("shortCode") String shortCode) {
        log.info("Redirect from short code: {}", shortCode);
        Optional<UrlMappingDTO> optionalMapping = urlService.handleRedirection(shortCode);
        return optionalMapping.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/qr")
    public ResponseEntity<UrlMappingDTO> generateQRCode(HttpServletResponse response, @Valid @RequestBody UrlRequest request) {
        String longUrl = request.getLongUrl();
        log.info("Generating QR code for URL: {}", longUrl);

        // Generate base64 QR code string
        UrlMapping savedMapping = urlService.generateQRCodeImage(longUrl);

        UrlMappingDTO dto = new UrlMappingDTO(savedMapping.getLongUrl(),
                                              null,
                                              savedMapping.getQrCodeData(),
                                              savedMapping.getNumClicks());

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
}
