package com.LinkShrink.urlservice.validator;

import org.apache.commons.validator.routines.UrlValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Lazy
@Component
public class CustomUrlValidator extends UrlValidator {

    @Value("${server.url}")
    private String baseUrl;

    @Override
    public boolean isValid(String url) {
        // Check if the URL starts with a protocol prefix
        if (url.matches("^\\w+://.*")) {
            return super.isValid(url);
        }
        return super.isValid("https://" + url);
    }
}
