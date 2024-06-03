package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.json.ObjectContent;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class UrlMappingResponseJsonTests {

    private JacksonTester<UrlMappingResponse> json;

    @BeforeEach
    void setup() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setDateFormat(new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy"));
        JacksonTester.initFields(this, mapper);
    }

    @Test
    void testSerialize() throws Exception {
        var urlMappingResponse = UrlMappingResponse.builder()
                .id(123L)
                .longUrl("https://www.example.com")
                .shortUrl("https://www.short.com")
                .qrCodeData("base64qrcodeimage")
                .createdAt(new Date())
                .title("title")
                .build();

        var jsonContent = json.write(urlMappingResponse);
        assertThat(jsonContent).extractingJsonPathNumberValue("$.id")
                .isEqualTo(urlMappingResponse.getId().intValue());
        assertThat(jsonContent).extractingJsonPathStringValue("$.longUrl")
                .isEqualTo(urlMappingResponse.getLongUrl());
        assertThat(jsonContent).extractingJsonPathStringValue("$.shortUrl")
                .isEqualTo(urlMappingResponse.getShortUrl());
        assertThat(jsonContent).extractingJsonPathStringValue("$.qrCodeData")
                .isEqualTo(urlMappingResponse.getQrCodeData());

        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        assertThat(jsonContent).extractingJsonPathStringValue("$.createdAt")
                .isEqualTo(dateFormat.format(urlMappingResponse.getCreatedAt()));
        assertThat(jsonContent).extractingJsonPathStringValue("$.title")
                .isEqualTo(urlMappingResponse.getTitle());
    }

    @Test
    void testDeserialize() throws Exception {
        var createdAtStr = "Mon Jun 03 19:10:02 IDT 2024";
        var content = String.format("""
        {
            "id": 123,
            "longUrl": "https://www.example.com",
            "shortUrl": "https://www.short.com",
            "qrCodeData": "base64qrcodeimage",
            "createdAt": "%s",
            "title": "title"
        }
        """, createdAtStr);

        ObjectContent<UrlMappingResponse> urlMappingResponse = json.parse(content);

        assertThat(urlMappingResponse.getObject().getId()).isEqualTo(123L);
        assertThat(urlMappingResponse.getObject().getLongUrl()).isEqualTo("https://www.example.com");
        assertThat(urlMappingResponse.getObject().getShortUrl()).isEqualTo("https://www.short.com");
        assertThat(urlMappingResponse.getObject().getQrCodeData()).isEqualTo("base64qrcodeimage");
        assertThat(urlMappingResponse.getObject().getTitle()).isEqualTo("title");

        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        Date expectedDate = dateFormat.parse(createdAtStr);
        assertThat(urlMappingResponse.getObject().getCreatedAt()).isEqualTo(expectedDate);
    }
}
