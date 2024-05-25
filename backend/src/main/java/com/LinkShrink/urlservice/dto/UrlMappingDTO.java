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
public class UrlMappingDTO {

    @NotNull
    private Long id;

    @NotBlank(message = "URL is required")
    private String longUrl;

    @Size(max = 6, message = "shortCode can be at most 6 characters long")
    private String shortUrl;

    private String QrCodeData;

    private Date createdAt;
}
