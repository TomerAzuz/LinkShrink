package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.constants.EmailTemplates;
import com.LinkShrink.urlservice.dto.UrlDto;
import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.event.UrlAccessedEvent;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidShortCodeException;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidUrlException;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.mapper.UrlMapper;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import com.LinkShrink.urlservice.validator.ShortCodeValidator;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
public class UrlService {
    private static final int SHORTCODE_LENGTH = 6;
    @Value("${server.url}")
    private String baseUrl;
    @Value("${spring.mail.username}")
    private String emailAddress;
    @Autowired
    private UrlRepository urlRepository;
    @Autowired
    private UrlMapper urlMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private CustomUrlValidator customUrlValidator;
    @Autowired
    private ShortCodeValidator shortCodeValidator;

    public UrlMappingResponse createUrlMapping(String longUrl) {
        if (!isValidUrl(longUrl)) {
            throw new InvalidUrlException("Invalid URL format");
        }

        UrlMapping urlMapping = constructUrlMapping(longUrl);
        urlRepository.save(urlMapping);

        return urlMapper.urlMappingToUrlMappingResponse(urlMapping);
    }

    public List<UrlMappingResponse> viewAllUrlMappings() {
        UserResponse user = userService.getCurrentUser();
        List<UrlMapping> urlMappingList = urlRepository.findAllByCreatedBy(user.getId());

        return urlMappingList
                .stream()
                .map(url -> urlMapper.urlMappingToUrlMappingResponse(url))
                .toList();
    }

    public UrlMappingResponse redirect(String shortCode, HttpServletRequest request) {
        if (!shortCodeValidator.isValidShortCode(shortCode) ||
                !urlRepository.existsByShortCode(shortCode)) {
            throw new InvalidShortCodeException("Invalid short code");
        }

        UrlMapping urlMapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlMappingNotFoundException("URL not found"));

            eventPublisher.publishEvent(new UrlAccessedEvent(urlMapping, request));
            return urlMapper.urlMappingToUrlMappingResponse(urlMapping);
    }

    public void deleteUrlMapping(Long id) {
        urlRepository.deleteById(id);
    }

    public String generateQRCodeImage(String longUrl) {

        String shortCode = generateShortCode();
        String shortUrl = baseUrl + "/" + shortCode;

        // Generate base64 QR code string
        ByteArrayOutputStream stream = QRCode.from(shortUrl).to(ImageType.PNG).stream();
        return Base64.getEncoder().encodeToString(stream.toByteArray());

    }

    public void handleMaliciousUrl(String url) throws MessagingException {
        if (!urlRepository.existsByLongUrl(url)) {
            throw new UrlMappingNotFoundException("URL not found");
        }
        UserResponse user = userService.getCurrentUser();

        String emailContent = String.format(
                EmailTemplates.MALICIOUS_URL_REPORT_TEMPLATE,
                user.getEmail(),
                url);
        emailService.sendSimpleMessage(emailAddress, "Malicious URL reported", emailContent);
    }

    public UrlDto unshortenUrl(String url) {
        String shortCode = extractShortCodeFromUrl(url);
        Optional<UrlMapping> optionalMapping = Optional.of(
                urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlMappingNotFoundException("URL not found")));

        UrlMapping urlMapping = optionalMapping.get();

        return new UrlDto(urlMapping.getLongUrl());
    }

    private boolean isValidUrl(String url) {
        return customUrlValidator.isValid(url);
    }

    private UrlMapping constructUrlMapping(String longUrl) {
        String shortCode = generateShortCode();
        String qrCodeData = generateQRCodeImage(longUrl);
        Date expirationDate = getExpirationDate();
        Long createdBy = userService.getCurrentUser().getId();
        String title = extractTitle(longUrl);

        return UrlMapping.create(
                longUrl, shortCode, qrCodeData, expirationDate, createdBy, title);
    }

    private Date getExpirationDate() {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DATE, 30);

        return calendar.getTime();
    }

    private String extractTitle(String url) {
        try {
            Document doc = Jsoup.connect(url).get();
            return doc.title();
        } catch (IOException e) {
            return "No title";
        }
    }

    private String generateShortCode() {
        String uuid = UUID.randomUUID().toString().replace("-", "");

        return uuid.substring(0, SHORTCODE_LENGTH);
    }

    private String extractShortCodeFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
