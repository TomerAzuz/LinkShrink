package com.LinkShrink.urlservice.validator;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Lazy
@Component
public class ShortCodeValidator {
    private static final int SHORTCODE_LENGTH = 6;
    private static final Pattern SHORTCODE_PATTERN = Pattern.compile("[a-zA-Z0-9]{" + SHORTCODE_LENGTH + "}");
    public boolean isValidShortCode(String shortCode) {
        return SHORTCODE_PATTERN.matcher(shortCode).matches();
    }
}
