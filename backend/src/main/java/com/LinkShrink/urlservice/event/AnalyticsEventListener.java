package com.LinkShrink.urlservice.event;

import com.LinkShrink.urlservice.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsEventListener {

    @Autowired
    private AnalyticsService analyticsService;

    @EventListener
    public void handleUrlAccessEvent(UrlAccessedEvent event) {
        analyticsService.saveUrlAnalytics(event.getUrlMapping(), event.getRequest());
    }
}
