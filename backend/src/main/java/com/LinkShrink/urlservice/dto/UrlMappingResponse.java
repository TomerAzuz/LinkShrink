package com.LinkShrink.urlservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingResponse {
    @NotNull
    private Long id;

    @NotBlank(message = "URL is required")
    private String longUrl;

    @Size(min = 6, max = 6, message = "shortCode must be 6 characters long")
    @NotBlank(message = "Short URL is required")
    private String shortUrl;

    @NotBlank(message = "QR code is required")
    private String qrCodeData;

    private Date createdAt;

    private String title;
}
