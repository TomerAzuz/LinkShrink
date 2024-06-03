package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class UserResponseJsonTests {

    @Autowired
    private JacksonTester<UserResponse> json;

    @Test
    void testSerialize() throws Exception {
        var userResponse = new UserResponse(
                1L,
                "Username",
                "user@email.com",
                true);

        var jsonContent = json.write(userResponse);
        assertThat(jsonContent).extractingJsonPathNumberValue("$.id")
                .isEqualTo(userResponse.getId().intValue());
        assertThat(jsonContent).extractingJsonPathStringValue("$.fullName")
                .isEqualTo(userResponse.getFullName());
        assertThat(jsonContent).extractingJsonPathStringValue("$.email")
                .isEqualTo(userResponse.getEmail());
        assertThat(jsonContent).extractingJsonPathBooleanValue("$.active")
                .isTrue();
    }

    @Test
    void testDeserialize() throws Exception {
        var content = """
        {
            "id": 123,
            "fullName": "Username",
            "email": "user@email.com",
            "active": true
        }
        """;
        var expectedUser = new UserResponse(123L, "Username", "user@email.com", true);

        assertThat(json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(expectedUser);
    }
}
