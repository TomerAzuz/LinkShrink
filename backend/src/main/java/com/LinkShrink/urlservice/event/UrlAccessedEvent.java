package com.LinkShrink.urlservice.event;

import com.LinkShrink.urlservice.model.UrlMapping;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UrlAccessedEvent extends ApplicationEvent {

    private final UrlMapping urlMapping;
    private final HttpServletRequest request;

    public UrlAccessedEvent(UrlMapping urlMapping, HttpServletRequest request) {
        super(urlMapping);
        this.urlMapping = urlMapping;
        this.request = request;
    }
}
