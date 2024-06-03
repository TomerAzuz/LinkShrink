package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.RegistrationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class RegistrationRequestJsonTests {

    @Autowired
    private JacksonTester<RegistrationRequest> json;

    @Test
    void testSerialize() throws Exception {
        var registrationRequest = RegistrationRequest
                .builder()
                .fullName("Full Name")
                .email("user@email.com")
                .password("password")
                .confirmPassword("password")
                .build();

        var jsonContent = json.write(registrationRequest);
        assertThat(jsonContent).extractingJsonPathStringValue("$.fullName")
                .isEqualTo(registrationRequest.getFullName());
        assertThat(jsonContent).extractingJsonPathStringValue("$.email")
                .isEqualTo(registrationRequest.getEmail());
        assertThat(jsonContent).extractingJsonPathStringValue("$.password")
                .isEqualTo(registrationRequest.getPassword());
        assertThat(jsonContent).extractingJsonPathStringValue("$.confirmPassword")
                .isEqualTo(registrationRequest.getConfirmPassword());
    }

    @Test
    void testDeserialize() throws IOException {
        var content = """
        {
            "fullName": "Full Name",
            "email": "user@email.com",
            "password": "password",
            "confirmPassword": "password"
        }
        """;

        var expectedRequest = RegistrationRequest.builder()
                                .fullName("Full Name")
                                .email("user@email.com")
                                .password("password")
                                .confirmPassword("password")
                                .build();

        assertThat(json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(expectedRequest);
    }
}
