package com.LinkShrink.urlservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@Entity
@Table(name = "url_mapping", indexes = {
       @Index(columnList = "shortCode", name = "short_code_index"),
       @Index(columnList = "createdBy", name ="created_by_index")
})
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "URL is required")
    @Column(nullable = false, length = 2048)
    private String longUrl;

    @Size(min = 6, max = 6, message = "short code must be 6 characters long")
    @Column(nullable = false, unique = true, length = 6)
    private String shortCode;

    @Column(columnDefinition = "TEXT")
    private String qrCodeData;

    @NotNull(message = "Expiration date is required")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;

    @NotNull(message = "Created by field is required")
    @Column(nullable = false)
    private Long createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt;

    private String title;

    public static UrlMapping create(
            String longUrl,
            String shortCode,
            String qrCodeData,
            Date expirationDate,
            Long createdBy,
            String title)
    {
        return UrlMapping.builder()
                .longUrl(longUrl)
                .shortCode(shortCode)
                .qrCodeData(qrCodeData)
                .expirationDate(expirationDate)
                .createdAt(new Date())
                .createdBy(createdBy)
                .title(title)
                .build();
    }
}
