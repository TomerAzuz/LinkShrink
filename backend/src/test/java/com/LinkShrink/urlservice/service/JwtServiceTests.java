package com.LinkShrink.urlservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestPropertySource(locations = "classpath:test.properties")
public class JwtServiceTests {

    @InjectMocks
    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        String secretKey = "324221acef13bc948c21f0ec1bca9e54d793ba5f5d08e103e5215030d432c163";
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        long jwtExpiration = 1000 * 60 * 60;
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", jwtExpiration);
        when(userDetails.getUsername()).thenReturn("Test User");
    }

    @Test
    public void testExtractUsername() {
        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);

        assertEquals("Test User", username);
    }

    @Test
    public void testGenerateToken() {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
    }

    @Test
    public void testGenerateTokenWithExtraClaims() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ROLE_USER");

        String token = jwtService.generateToken(extraClaims, userDetails);

        assertNotNull(token);
    }

    @Test
    public void testIsTokenValid() {
        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

}
