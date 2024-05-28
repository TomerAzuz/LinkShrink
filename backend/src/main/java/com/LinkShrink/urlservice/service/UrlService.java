package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.event.UrlAccessedEvent;
import com.LinkShrink.urlservice.exception.InvalidUrlException;
import com.LinkShrink.urlservice.exception.UrlMappingNotFoundException;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.model.User;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import com.LinkShrink.urlservice.validator.ShortCodeValidator;
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

    private static final int ID_LENGTH = 6;

    @Value("${server.url}")
    private String baseUrl;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private CustomUrlValidator customUrlValidator;

    @Autowired
    private ShortCodeValidator shortCodeValidator;


    public UrlMapping createUrlMapping(String longUrl) {
        if (!isValidUrl(longUrl)) {
            throw new InvalidUrlException("Invalid URL format");
        }
        String shortCode = generateShortCode();
        while (shortCodeExists(shortCode)) {
            shortCode = generateShortCode();
        }
        Date expirationDate = getExpirationDate();

        User currentUser = userService.getCurrentUser();

        String title = extractTitle(longUrl);

        UrlMapping urlMapping = UrlMapping
                .hiddenBuilder()
                .longUrl(longUrl)
                .shortCode(shortCode)
                .expirationDate(expirationDate)
                .createdAt(new Date())
                .createdBy(currentUser.getId())
                .title(title)
                .build();

        return urlRepository.save(urlMapping);
    }

    public List<UrlMapping> getAllUrlMappings() {
        User user = userService.getCurrentUser();
        return urlRepository.findAllByCreatedBy(user.getId());
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
            return null;
        }
    }

    public Optional<UrlMappingDTO> handleRedirection(String shortCode, HttpServletRequest request) {
        try {
            if (!ShortCodeValidator.isValidShortCode(shortCode)) {
                return Optional.empty();
            }

            Optional<UrlMapping> optionalMapping = urlRepository.findByShortCode(shortCode);
            if (optionalMapping.isPresent()) {
                UrlMapping urlMapping = optionalMapping.get();

                eventPublisher.publishEvent(new UrlAccessedEvent(urlMapping, request));

                return Optional.of(UrlMappingDTO
                        .builder()
                        .longUrl(urlMapping.getLongUrl())
                        .shortUrl(baseUrl + "/" + shortCode)
                        .createdAt(urlMapping.getCreatedAt())
                        .build());
            }
            return Optional.empty();
        } catch (Exception e) {
            throw new UrlMappingNotFoundException(e.getMessage());
        }
    }

    public void deleteUrlMapping(Long id) {
        urlRepository.deleteById(id);
    }

    public UrlMapping generateQRCodeImage(String longUrl) {
        ByteArrayOutputStream stream = QRCode.from(longUrl).to(ImageType.PNG).stream();
        String base64QrCode = Base64.getEncoder().encodeToString(stream.toByteArray());

        String title = extractTitle(longUrl);
        Date expirationDate = getExpirationDate();
        User currentUser = userService.getCurrentUser();

        UrlMapping urlMapping = UrlMapping.hiddenBuilder()
                .longUrl(longUrl)
                .qrCodeData(base64QrCode)
                .expirationDate(expirationDate)
                .createdBy(currentUser.getId())
                .createdAt(new Date())
                .title(title)
                .build();

        return urlRepository.save(urlMapping);
    }

    private boolean isValidUrl(String url) {
        return customUrlValidator.isValid(url);
    }

    private String generateShortCode() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, ID_LENGTH);
    }

    private boolean shortCodeExists(String shortCode) {
        return urlRepository.existsByShortCode(shortCode);
    }
}
