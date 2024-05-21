package com.LinkShrink.urlservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlMappingDTO {

    @NotBlank(message = "URL is required")
    private String longUrl;

    private String shortUrl;

    private String QrCodeData;

    private long numClicks;
}
