package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.RefreshTokenRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class RefreshTokenRequestJsonTests {

    @Autowired
    private JacksonTester<RefreshTokenRequest> json;

    @Test
    void testSerialize() throws Exception {
        var refreshRequest = new RefreshTokenRequest("Bearer refreshJwt");
        var jsonContent = json.write(refreshRequest);

        assertThat(jsonContent).extractingJsonPathStringValue("$.refreshToken")
                .isEqualTo(refreshRequest.getRefreshToken());
    }

    @Test
    void testDeserialize() throws IOException {
        var content = """
        {
            "refreshToken": "Bearer refreshJwt"
        }
        """;

        var expectedRequest = new RefreshTokenRequest("Bearer refreshJwt");

        assertThat(json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(expectedRequest);
    }
}
