package com.LinkShrink.urlservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "url_mapping", indexes = {
       @Index(columnList = "shortCode", name = "short_code_index")
})
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "URL is required")
    private String longUrl;

    private String shortCode;

    @Column(columnDefinition = "TEXT")
    private String qrCodeData;

    private long numClicks;

    @NotNull(message = "Expiration date is required")
    private Date expirationDate;

    @CreatedDate
    private String createdAt;
}
