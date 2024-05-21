package com.LinkShrink.urlservice;

import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UrlRepositoryTest {

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
