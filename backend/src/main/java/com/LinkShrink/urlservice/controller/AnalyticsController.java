package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.LinkShrink.urlservice.constants.UrlPaths.API_V1_ANALYTICS;

@RestController
@RequestMapping(API_V1_ANALYTICS)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<UrlAnalytics> getAnalyticsByUrlId(@PathVariable("urlId") Long urlId) {
        return analyticsService.viewAnalyticsByUrlId(urlId);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UrlAnalytics> getAllAnalytics() {
        return analyticsService.viewAllAnalytics();
    }
}
