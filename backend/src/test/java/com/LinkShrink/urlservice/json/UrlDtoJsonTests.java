package com.LinkShrink.urlservice.json;

import com.LinkShrink.urlservice.dto.UrlDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;

import static org.assertj.core.api.Assertions.assertThat;

@JsonTest
public class UrlDtoJsonTests {

    @Autowired
    private JacksonTester<UrlDto> json;


    @Test
    void testSerialize() throws Exception {
        var urlDto = new UrlDto("https://www.example.com");
        var jsonContent = json.write(urlDto);

        assertThat(jsonContent).extractingJsonPathStringValue("$.url")
                .isEqualTo(urlDto.getUrl());
    }

    @Test
    void testDeserialize() throws Exception {
        var content = """
        {
            "url": "https://www.example.com"
        }
        """;
        var expectedUrlDto = new UrlDto("https://www.example.com");

        assertThat(json.parse(content))
                .usingRecursiveComparison()
                .isEqualTo(expectedUrlDto);
    }
}
