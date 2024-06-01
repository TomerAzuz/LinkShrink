package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.UrlDto;
import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.filter.JwtAuthenticationFilter;
import com.LinkShrink.urlservice.mapper.UrlMapper;
import com.LinkShrink.urlservice.mapper.UserMapper;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Date;
import java.util.List;

import static com.LinkShrink.urlservice.constants.UrlPaths.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UrlController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UrlControllerTests {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private UrlMapper urlMapper;
    @MockBean
    private UserMapper userMapper;
    @MockBean
    private Bucket bucket;
    @MockBean
    private UrlService urlService;
    @MockBean
    private JwtAuthenticationFilter jwtFilter;
    private static final String BASE_URL = "http://localhost:9000";

    @Test
    void testShortenUrl() throws Exception {
        String longUrl = "http://www.example.com";
        String shortCode = "abc123";
        String qrCode = "QR1";
        Long id = 123L;

        Date createdAt = new Date();

        UrlMapping savedMapping = UrlMapping.create(
                longUrl,
                shortCode,
                qrCode,
                createdAt,
                id,
                "Title");

        UrlMappingResponse response = UrlMappingResponse.builder()
                .id(id)
                .longUrl(longUrl)
                .shortUrl(BASE_URL + "/" + shortCode)
                .qrCodeData(qrCode)
                .createdAt(createdAt)
                .title("Title")
                .build();

        given(urlService.createUrlMapping(longUrl)).willReturn(response);
        given(urlMapper.urlMappingToUrlMappingResponse(savedMapping)).willReturn(response);


        UrlDto urlDTO = new UrlDto(longUrl);
        String requestBody = objectMapper.writeValueAsString(urlDTO);

        mockMvc.perform(MockMvcRequestBuilders.post(API_V1_URL + SHORTEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.longUrl").value(longUrl))
                .andExpect(jsonPath("$.shortUrl").value(BASE_URL + "/" + shortCode))
                .andExpect(jsonPath("$.qrCodeData").value(qrCode))
                .andExpect(jsonPath("$.title").value("Title"));
    }

    @Test
    void testGetUrlMappings() throws Exception {
        UrlMappingResponse response1 = UrlMappingResponse.builder()
                .id(1L)
                .longUrl("http://www.example1.com")
                .shortUrl(BASE_URL + "/short1")
                .qrCodeData("QR1")
                .createdAt(new Date())
                .title("Title1")
                .build();

        UrlMappingResponse response2 = UrlMappingResponse.builder()
                .id(2L)
                .longUrl("http://www.example2.com")
                .shortUrl(BASE_URL + "/short2")
                .qrCodeData("QR2")
                .createdAt(new Date())
                .title("Title2")
                .build();

        given(urlService.viewAllUrlMappings()).willReturn(List.of(response1, response2));

        mockMvc.perform(MockMvcRequestBuilders.get(API_V1_URL + MY_LINKS))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].longUrl").value("http://www.example1.com"))
                .andExpect(jsonPath("$[1].longUrl").value("http://www.example2.com"));
    }

    @Test
    void testDeleteUrlMapping() throws Exception {
        long urlId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.delete(API_V1_URL + "/" + urlId))
                .andExpect(status().isNoContent());
    }

    @Test
    void testReportMaliciousUrl() throws Exception {
        String maliciousUrl = "http://www.malicious.com";
        UrlDto urlDto = new UrlDto(maliciousUrl);
        String requestBody = objectMapper.writeValueAsString(urlDto);

        mockMvc.perform(MockMvcRequestBuilders.post(API_V1_URL + REPORT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());
    }
}
