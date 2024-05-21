package com.LinkShrink.urlservice;

import com.LinkShrink.urlservice.controller.UrlController;
import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.dto.UrlRequest;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UrlController.class)
public class UrlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UrlService urlService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Bucket bucket;

    @Test
    void testShortenUrl() throws Exception {
        String longUrl = "http://www.example.com";
        UrlMapping savedMapping = new UrlMapping(1L, longUrl, "abc123", null, 0L, null, null);
        given(urlService.createUrlMapping(longUrl)).willReturn(savedMapping);

        UrlRequest urlRequest = new UrlRequest(longUrl);
        String requestBody = objectMapper.writeValueAsString(urlRequest);

        mockMvc
            .perform(MockMvcRequestBuilders.post("/api/v1/url/shorten")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.longUrl").value(longUrl))
                .andExpect(jsonPath("$.shortUrl").isNotEmpty())
                .andExpect(jsonPath("$.numClicks").value(0));
    }

    @Test
    void testRedirectUrlValidShortCode() throws Exception {
        String shortCode = "abc123";
        String longUrl = "httpp://www.example.com";
        UrlMappingDTO mappingDTO = new UrlMappingDTO(longUrl, "http://localhost:9000/" + shortCode, null, 0L);
        given(urlService.handleRedirection(shortCode)).willReturn(Optional.of(mappingDTO));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/url/{shortCode}", shortCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.longUrl").value(longUrl))
                .andExpect(jsonPath("$.shortUrl").value("http://localhost:9000/" + shortCode))
                .andExpect(jsonPath("$.numClicks").value(0));
    }

    @Test
    void testGenerateQRCode() throws Exception {
        String longUrl = "http://www.example.com";
        String base64QrCode = "AQID";
        UrlMapping savedMapping = new UrlMapping(1L, longUrl, null, base64QrCode, 0L, null, null);
        given(urlService.generateQRCodeImage(longUrl)).willReturn(savedMapping);

        UrlRequest urlRequest = new UrlRequest(longUrl);
        String requestBody = objectMapper.writeValueAsString(urlRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/url/qr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.qrCodeData").value(base64QrCode));
    }
}
