package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.AuthResponse;
import com.LinkShrink.urlservice.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class AuthResponseJsonTests {

    @Autowired
    private JacksonTester<AuthResponse> json;

    @Test
    void testSerialize() throws Exception {
        var userResponse = new UserResponse(
                1L,
                "Username",
                "user@email.com",
                true);

        var authResponse = AuthResponse.builder()
                .token("Bearer jwt")
                .refreshToken("Bearer refreshJwt")
                .expiresIn(3600L)
                .user(userResponse)
                .build();

        var jsonContent = json.write(authResponse);

        assertThat(jsonContent).extractingJsonPathStringValue("$.token")
                .isEqualTo(authResponse.getToken());
        assertThat(jsonContent).extractingJsonPathStringValue("$.refreshToken")
                .isEqualTo(authResponse.getRefreshToken());
        assertThat(jsonContent).extractingJsonPathNumberValue("$.expiresIn")
                .isEqualTo(authResponse.getExpiresIn().intValue());
        assertThat(jsonContent).extractingJsonPathNumberValue("$.user.id")
                .isEqualTo(authResponse.getUser().getId().intValue());
        assertThat(jsonContent).extractingJsonPathStringValue("$.user.fullName")
                .isEqualTo(authResponse.getUser().getFullName());
        assertThat(jsonContent).extractingJsonPathStringValue("$.user.email")
                .isEqualTo(authResponse.getUser().getEmail());
        assertThat(jsonContent).extractingJsonPathBooleanValue("$.user.active")
                .isTrue();
    }

    @Test
    void testDeserialize() throws Exception {
        var content = """
        {
            "token": "Bearer jwtToken",
            "refreshToken": "Bearer refreshJwt",
            "expiresIn": 3600,
            "user": {
                "id": 123,
                 "fullName": "Username",
                 "email": "user@email.com",
                 "active": true
            }
        }
        """;

        var expectedUser = new UserResponse(123L, "Username", "user@email.com", true);

        var expectedAuthResponse = AuthResponse.builder()
                .token("Bearer jwtToken")
                .refreshToken("Bearer refreshJwt")
                .expiresIn(3600L)
                .user(expectedUser)
                .build();

        assertThat(json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(expectedAuthResponse);
    }
}
