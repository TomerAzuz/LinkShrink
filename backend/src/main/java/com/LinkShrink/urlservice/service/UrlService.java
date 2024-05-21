package com.LinkShrink.urlservice.service;

import com.LinkShrink.urlservice.dto.UrlMappingDTO;
import com.LinkShrink.urlservice.exception.InvalidUrlException;
import com.LinkShrink.urlservice.exception.ShortCodeNotFoundException;
import com.LinkShrink.urlservice.model.UrlMapping;
import com.LinkShrink.urlservice.repository.UrlRepository;
import com.LinkShrink.urlservice.validator.CustomUrlValidator;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.*;

@Service
public class UrlService {

    private static final int ID_LENGTH = 6;

    @Value("${server.url}")
    private String baseUrl;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private CustomUrlValidator customUrlValidator;

    public UrlMapping createUrlMapping(String longUrl) {
        if (!isValidUrl(longUrl)) {
            throw new InvalidUrlException("Invalid URL format");
        }
        String shortCode = generateShortCode();
        while (shortCodeExists(shortCode)) {
            shortCode = generateShortCode();
        }
        Date expirationDate = getExpirationDate();

        UrlMapping urlMapping = new UrlMapping(null, longUrl, shortCode, null, 0L, expirationDate, null);
        return urlRepository.save(urlMapping);
    }

    private Date getExpirationDate() {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DATE, 30);
        return calendar.getTime();
    }

    public Optional<UrlMappingDTO> handleRedirection(String shortCode) {
        Optional<String> longUrl = getLongUrlFromShortCode(shortCode);
        long numClicks = incrementClicks(shortCode);
        return longUrl.map(url -> new UrlMappingDTO(url, baseUrl + "/" + shortCode, null, numClicks));
    }

    private Optional<String> getLongUrlFromShortCode(String shortCode) {
        try {
            Optional<UrlMapping> optionalMapping = urlRepository.findByShortCode(shortCode);
            return optionalMapping.map(UrlMapping::getLongUrl);
        } catch (Exception e) {
            throw new ShortCodeNotFoundException("Error retrieving long URL for short code: " + shortCode);
        }
    }

    @Transactional
    public long incrementClicks(String shortCode) {
        Optional<UrlMapping> optionalMapping = urlRepository.findByShortCode(shortCode);
        UrlMapping urlMapping = optionalMapping.orElseThrow(() -> new ShortCodeNotFoundException("Short code not found: " + shortCode));
        urlMapping.setNumClicks(urlMapping.getNumClicks() + 1L);
        urlRepository.save(urlMapping);
        return urlMapping.getNumClicks();
    }

    public UrlMapping generateQRCodeImage(String longUrl) {
        ByteArrayOutputStream stream = QRCode.from(longUrl).to(ImageType.PNG).stream();
        String base64QrCode = Base64.getEncoder().encodeToString(stream.toByteArray());
        Date expirationDate = getExpirationDate();
        UrlMapping urlMapping = new UrlMapping(null, longUrl, null, base64QrCode, 0L, expirationDate, null);
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
