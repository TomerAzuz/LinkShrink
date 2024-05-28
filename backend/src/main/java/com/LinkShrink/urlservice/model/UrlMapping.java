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
@Builder(builderMethodName = "hiddenBuilder")
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

    @Size(min = 6, max = 6, message = "shortCode must be 6 characters long")
    private String shortCode;

    @Column(columnDefinition = "TEXT")
    private String qrCodeData;

    @NotNull(message = "Expiration date is required")
    private Date expirationDate;

    @NotNull(message = "Created by field is required")
    private Long createdBy;

    private Date createdAt;

    private String title;

    public static class UrlMappingBuilder {
        private String shortCode;
        private String qrCodeData;

        public UrlMappingBuilder shortCode(String shortCode) {
            if (this.qrCodeData != null) {
                throw new IllegalArgumentException("Cannot set both short code and qr code");
            }
            this.shortCode = shortCode;
            return this;
        }

        public UrlMappingBuilder qrCodeData(String qrCodeData) {
            if (this.shortCode != null) {
                throw new IllegalArgumentException("Cannot set both short code and qr code");
            }
            this.qrCodeData = qrCodeData;
            return this;
        }

        public UrlMapping build() {
            if (this.shortCode == null && this.qrCodeData == null) {
                throw new IllegalArgumentException("Either shortCode or qrCodeData must be set");
            }
            return new UrlMapping(this.id, this.longUrl, this.shortCode, this.qrCodeData,
                                  this.expirationDate, this.createdBy, this.createdAt, this.title);
        }
    }
}
