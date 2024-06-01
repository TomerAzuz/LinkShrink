package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.AnalyticsRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.DeviceType;
import eu.bitwalker.useragentutils.UserAgent;

import java.util.*;

import static com.LinkShrink.urlservice.constants.UrlPaths.IP_API_URL;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private UserService userService;

    public void saveUrlAnalytics(UrlMapping urlMapping, HttpServletRequest request) {
        UrlAnalytics analytics = buildAnalytics(urlMapping, request);
        analyticsRepository.save(analytics);
    }

    private UrlAnalytics buildAnalytics(UrlMapping urlMapping, HttpServletRequest request) {
        UrlAnalytics analytics = new UrlAnalytics();

        analytics.setAccessTime(new Date());
        analytics.setUrlMapping(urlMapping);

        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        String country = getCountryFromIp(ipAddress);
        analytics.setCountry(country);
        String browser = getBrowser(userAgent);
        analytics.setBrowser(browser);
        String deviceType = getDeviceType(userAgent);
        analytics.setDeviceType(deviceType);

        return analytics;
    }

    public List<UrlAnalytics> viewAnalyticsByUrlId(Long urlId) {
        if (!analyticsRepository.existsByUrlMappingId(urlId)) {
            throw new UrlMappingNotFoundException("URL not found");
        }
        UserResponse user = userService.getCurrentUser();
        return analyticsRepository
                .findByUrlMappingIdAndUrlMapping_CreatedBy(urlId, user.getId());
    }

    public List<UrlAnalytics> viewAllAnalytics() {
        UserResponse user = userService.getCurrentUser();
        return analyticsRepository.findAllByUrlMapping_CreatedBy(user.getId());
    }

    private Map<Long, List<UrlAnalytics>> aggregateByUrlId(List<List<UrlAnalytics>> allAnalytics) {
        Map<Long, List<UrlAnalytics>> aggregatedData = new HashMap<>();
        for (List<UrlAnalytics> analytics : allAnalytics) {
            for (UrlAnalytics access : analytics) {
                Long urlMappingId = access.getUrlMapping().getId();
                aggregatedData.putIfAbsent(urlMappingId, new ArrayList<>());
                aggregatedData.get(urlMappingId).add(access);
            }
        }
        return aggregatedData;
    }

    private String getCountryFromIp(String ip) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(
                IP_API_URL + "?fields=country&query=" + ip,
                String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            return responseBody != null ?
                    extractCountryFromJson(responseBody) : "Unknown";
        }
        return "Unknown";
    }

    private String extractCountryFromJson(String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(json);
            return rootNode.get("country").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private String getBrowser(String userAgent) {
        if (userAgent.isEmpty()) {
            return "Unknown";
        }
        Browser browser = UserAgent.parseUserAgentString(userAgent).getBrowser();
        return browser != null ? browser.getGroup().getName() : "Unknown";
    }

    private String getDeviceType(String userAgent) {
        if (userAgent.isEmpty()) {
           return "Unknown";
        }
        DeviceType deviceType = UserAgent.parseUserAgentString(userAgent).getOperatingSystem().getDeviceType();
        return deviceType != null ? deviceType.getName() : "Unknown";
    }
}
