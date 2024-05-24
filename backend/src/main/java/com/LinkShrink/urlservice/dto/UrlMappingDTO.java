package com.LinkShrink.urlservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDTO {

    @NotBlank(message = "URL is required")
    private String longUrl;

    @Size(max = 6, message = "shortCode can be at most 6 characters long")
    private String shortUrl;

    private String QrCodeData;

    private long numClicks;
}
