package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class ErrorResponseJsonTests {

    private JacksonTester<ErrorResponse> json;

    @BeforeEach
    void setup() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setDateFormat(new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy"));
        JacksonTester.initFields(this, mapper);
    }

    @Test
    void testSerialize() throws Exception {
        var timestamp = new Date();
        var errorResponse = new ErrorResponse(
                timestamp,
                401,
                "Error",
                "Invalid credentials",
                "api/v1/auth/login"
        );

        var jsonContent = json.write(errorResponse);
        assertThat(jsonContent).extractingJsonPathNumberValue("$.status")
                .isEqualTo(errorResponse.getStatus());
        assertThat(jsonContent).extractingJsonPathStringValue("$.error")
                .isEqualTo(errorResponse.getError());
        assertThat(jsonContent).extractingJsonPathStringValue("$.message")
                .isEqualTo(errorResponse.getMessage());
        assertThat(jsonContent).extractingJsonPathStringValue("$.path")
                .isEqualTo(errorResponse.getPath());

        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        assertThat(jsonContent).extractingJsonPathStringValue("$.timestamp")
                .isEqualTo(dateFormat.format(errorResponse.getTimestamp()));
    }

    @Test
    void testDeserialize() throws Exception {
        var timestampStr = "Mon Jun 03 19:10:02 IDT 2024";
        var content = String.format("""
        {
            "timestamp": "%s",
            "status": 401,
            "error": "Error",
            "message": "Invalid credentials",
            "path": "api/v1/auth/login"
        }
        """, timestampStr);

        var errorResponse = json.parse(content);

        assertThat(errorResponse.getObject().getStatus()).isEqualTo(401);
        assertThat(errorResponse.getObject().getError()).isEqualTo("Error");
        assertThat(errorResponse.getObject().getMessage()).isEqualTo("Invalid credentials");
        assertThat(errorResponse.getObject().getPath()).isEqualTo("api/v1/auth/login");

        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        Date expectedDate = dateFormat.parse(timestampStr);
        assertThat(errorResponse.getObject().getTimestamp()).isEqualTo(expectedDate);
    }
}
