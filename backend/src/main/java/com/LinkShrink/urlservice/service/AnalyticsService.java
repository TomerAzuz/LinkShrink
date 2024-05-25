package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.model.UrlAnalytics;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.AnalyticsRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.DeviceType;
import eu.bitwalker.useragentutils.UserAgent;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private UserService userService;

    private static final String API_URL = "http://ip-api.com/json/";

    public void saveUrlAnalytics(UrlMapping urlMapping, HttpServletRequest request) {
        UrlAnalytics analytics = buildAnalytics(urlMapping, request);
        System.out.println(analytics);
        analyticsRepository.save(analytics);
    }

    private UrlAnalytics buildAnalytics(UrlMapping urlMapping, HttpServletRequest request) {
        UrlAnalytics analytics = new UrlAnalytics();
        analytics.setUrlMapping(urlMapping);

        String userAgent = request.getHeader("User-Agent");

        analytics.setAccessTime(new Date());

        String ipAddress = request.getRemoteAddr();
        String country = getCountryFromIp(ipAddress);
        analytics.setCountry(country);

        String browser = getBrowser(userAgent);
        analytics.setBrowser(browser);

        String deviceType = getDeviceType(userAgent);
        analytics.setDeviceType(deviceType);

        return analytics;
    }

    public List<UrlAnalytics> getAnalyticsById(Long urlMappingId) {
        User user = userService.getCurrentUser();
        return analyticsRepository.findByUrlMappingIdAndUrlMapping_CreatedBy(urlMappingId, user.getId());
    }

    public List<UrlAnalytics> getAllAnalytics() {
        User user = userService.getCurrentUser();
        return analyticsRepository.findAllByUrlMapping_CreatedBy(user.getId());
        //return aggregateByUrlId(allAnalytics);
    }

//    private Map<Long, List<UrlAnalytics>> aggregateByUrlId(List<List<UrlAnalytics>> allAnalytics) {
//        Map<Long, List<UrlAnalytics>> aggregatedData = new HashMap<>();
//        for (List<UrlAnalytics> analytics : allAnalytics) {
//            for (UrlAnalytics access : analytics) {
//                Long urlMappingId = access.getUrlMapping().getId();
//                aggregatedData.putIfAbsent(urlMappingId, new ArrayList<>());
//                aggregatedData.get(urlMappingId).add(access);
//            }
//        }
//        return aggregatedData;
//    }

    private String getCountryFromIp(String ip) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(API_URL + "?fields=country&query=" + ip, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            if (responseBody == null)
                return "Unknown";
            int startIndex = responseBody.indexOf("\"country\":\"");
            if (startIndex != -1) {
                int endIndex = responseBody.indexOf('"', startIndex + "\"country\":\"".length());
                if (endIndex != -1) {
                    return responseBody.substring(startIndex + "\"country\":\"".length(), endIndex);
                }
            }
        }
        return "Unknown";
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
