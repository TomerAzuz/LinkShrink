package com.LinkShrink.urlservice;

import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class UrlRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgresql = new PostgreSQLContainer<>(DockerImageName.parse("postgres:14.10"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresql::getJdbcUrl);
        registry.add("spring.datasource.username", postgresql::getUsername);
        registry.add("spring.datasource.password", postgresql::getPassword);
        registry.add("spring.datasource.driver-class-name", postgresql::getDriverClassName);
    }

    @Autowired
    private UrlRepository urlRepository;

    private UrlMapping urlMapping;

    @BeforeEach
    void setUp() {
        String longUrl = "http://www.example.com";
        String shortCode = "abc123";
        urlMapping = UrlMapping.hiddenBuilder()
                        .longUrl(longUrl)
                        .shortCode(shortCode)
                        .expirationDate(new Date())
                        .build();
        urlRepository.save(urlMapping);
    }

    @Test
    void testExistsByShortCodeExists() {
        boolean exists = urlRepository.existsByShortCode("abc123");
        assertTrue(exists);
    }

    @Test
    void testExistsByShortCodeNotExists() {
        boolean exists = urlRepository.existsByShortCode("xyz789");
        assertFalse(exists);
    }

    @Test
    void testFindByShortCodeExists() {
        Optional<UrlMapping> found = urlRepository.findByShortCode("abc123");
        assertTrue(found.isPresent());
        assertEquals(urlMapping.getLongUrl(), found.get().getLongUrl());
    }

    @Test
    void findByShortCodeNotExists() {
        Optional<UrlMapping> found = urlRepository.findByShortCode("xyz789");
        assertFalse(found.isPresent());
    }
}
