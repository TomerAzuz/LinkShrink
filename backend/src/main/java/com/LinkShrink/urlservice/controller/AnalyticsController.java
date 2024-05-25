package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.exception.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("{id}")
    public ResponseEntity<List<UrlAnalytics>> getAnalyticsById(@PathVariable("id") Long id) {
        List<UrlAnalytics> urlAnalytics = analyticsService.getAnalyticsById(id);
        if (urlAnalytics == null) {
            throw new UrlMappingNotFoundException("Analytics not found for id: " + id);
        }
        return ResponseEntity.ok(urlAnalytics);
    }

    @GetMapping
    public ResponseEntity<List<UrlAnalytics>> getAllAnalytics() {
        List<UrlAnalytics> allAnalytics = analyticsService.getAllAnalytics();
        return ResponseEntity.ok(allAnalytics);
    }
}
