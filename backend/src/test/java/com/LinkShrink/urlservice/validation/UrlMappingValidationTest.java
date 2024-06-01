//package com.LinkShrink.urlservice.UrlServiceTests;
//
//import com.LinkShrink.urlservice.validator.CustomUrlValidator;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@WebMvcTest(CustomUrlValidator.class)
//public class UrlMappingValidationTest {
//
//    @Autowired
//    private CustomUrlValidator customUrlValidator;
//
//    @Test
//    public void testLongURLValidationWithValidURL() {
//        String validUrl = "www.example.com";
//        assertTrue(customUrlValidator.isValid(validUrl));
//    }
//
//    @Test
//    public void testLongURLValidationWithInvalidURL() {
//        String invalidUrl = "invalid-url";
//        assertFalse(customUrlValidator.isValid(invalidUrl));
//    }
//
//    @Test
//    public void testLongURLValidationWithBaseURL() {
//        String invalidUrl = "https://localhost:9000";
//        assertFalse(customUrlValidator.isValid(invalidUrl));
//    }
//}
