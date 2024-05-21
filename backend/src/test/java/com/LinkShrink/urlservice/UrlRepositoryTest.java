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

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class UrlRepositoryTest {

    @Container
    public static PostgreSQLContainer<?> postgresDB = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("linkshrink_db")
            .withUsername("user")
            .withPassword("password");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresDB::getJdbcUrl);
        registry.add("spring.datasource.username", postgresDB::getUsername);
        registry.add("spring.datasource.password", postgresDB::getPassword);
        registry.add("spring.datasource.driver-class-name", postgresDB::getDriverClassName);
    }

    @Autowired
    private UrlRepository urlRepository;

    private UrlMapping urlMapping;

    @BeforeEach
    void setUp() {
        urlMapping = new UrlMapping(null, "http://www.example.com",  "abc123", null, 0L, new Date(), null);
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
