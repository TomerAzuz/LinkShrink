package com.LinkShrink.urlservice.controller;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.LinkShrink.urlservice.constants.SwaggerConstants.*;
import static com.LinkShrink.urlservice.constants.UrlPaths.API_V1_ANALYTICS;


@RestController
@RequestMapping(API_V1_ANALYTICS)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_ANALYTICS_BY_ID, description = DESC_ANALYTICS_BY_ID)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "404", description = "URL not found",
                    content = { @Content(schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public List<UrlAnalytics> getAnalyticsByUrlId(@PathVariable("urlId") Long urlId) {
        return analyticsService.viewAnalyticsByUrlId(urlId);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = SUMMARY_ANALYTICS_ALL, description = DESC_ANALYTICS_ALL)
    public List<UrlAnalytics> getAllAnalytics() {
        return analyticsService.viewAllAnalytics();
    }
}
