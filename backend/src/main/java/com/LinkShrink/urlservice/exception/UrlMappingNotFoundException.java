package com.LinkShrink.urlservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UrlMappingNotFoundException extends RuntimeException {
    public UrlMappingNotFoundException(String message) {
        super(message);
    }
}
