package com.LinkShrink.urlservice;

import com.LinkShrink.urlservice.controller.UrlController;
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

import java.util.Date;

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
        UrlMapping savedMapping = UrlMapping.hiddenBuilder()
                .longUrl(longUrl)
                .shortCode("abc123")
                .createdAt(new Date())
                .build();

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

//    @Test
//    void testRedirectUrlValidShortCode() throws Exception {
//        String baseUrl = "http://localhost:9000";
//        String shortCode = "abc123";
//        String longUrl = "httpp://www.example.com";
//        UrlMappingDTO mappingDTO = UrlMappingDTO.builder()
//                .longUrl(longUrl)
//                .shortUrl(baseUrl + "/" + shortCode)
//                .createdAt(new Date())
//                .build();
//
//        given(urlService.handleRedirection(shortCode)).willReturn(Optional.of(mappingDTO));
//
//        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/url/{shortCode}", shortCode))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.longUrl").value(longUrl))
//                .andExpect(jsonPath("$.shortUrl").value("http://localhost:9000/" + shortCode))
//                .andExpect(jsonPath("$.numClicks").value(0));
//    }

    @Test
    void testGenerateQRCode() throws Exception {
        String longUrl = "http://www.example.com";
        String base64QrCode = "AQID";
        UrlMapping savedMapping = UrlMapping.hiddenBuilder()
                .longUrl(longUrl)
                .qrCodeData(base64QrCode).build();

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
