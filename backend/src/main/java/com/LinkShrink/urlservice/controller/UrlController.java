package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.dto.UrlRequest;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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
        UrlMappingDTO dto = new UrlMappingDTO(
                                              savedMapping.getId(),
                                              savedMapping.getLongUrl(),
                                              baseUrl + "/" + savedMapping.getShortCode(),
                                              null,
                                              new Date());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/my-links")
    public ResponseEntity<List<UrlMappingDTO>> getUrlMappings() {
        log.info("Getting all url mappings");
        List<UrlMapping> urlMappings = urlService.getAllUrlMappings();
        List<UrlMappingDTO> urlMappingDTOS = urlMappings
                .stream()
                .map(url -> new UrlMappingDTO(
                        url.getId(),
                        url.getLongUrl(),
                        baseUrl + "/" + url.getShortCode(),
                        url.getQrCodeData(),
                        url.getCreatedAt())).toList();
        return ResponseEntity.ok(urlMappingDTOS);
    }

    @GetMapping("{shortCode}")
    public ResponseEntity<UrlMappingDTO> redirectUrl(@PathVariable("shortCode") String shortCode, HttpServletRequest request) {
        log.info("Redirect from short code: {}", shortCode);
        Optional<UrlMappingDTO> urlMappingDTO = urlService.handleRedirection(shortCode, request);
        return urlMappingDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/qr")
    public ResponseEntity<UrlMappingDTO> generateQRCode(@Valid @RequestBody UrlRequest request) {
        String longUrl = request.getLongUrl();
        log.info("Generating QR code for URL: {}", longUrl);

        // Generate base64 QR code string
        UrlMapping savedMapping = urlService.generateQRCodeImage(longUrl);

        UrlMappingDTO dto = new UrlMappingDTO(
                                              savedMapping.getId(),
                                              savedMapping.getLongUrl(),
                                              null,
                                              savedMapping.getQrCodeData(),
                                              savedMapping.getCreatedAt());

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUrlMapping(@PathVariable("id") Long id) {
        log.info("Removing url mapping with id {}", id);
        urlService.deleteUrlMapping(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
