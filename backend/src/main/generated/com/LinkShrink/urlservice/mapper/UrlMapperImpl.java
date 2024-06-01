package com.LinkShrink.urlservice.mapper;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.model.UrlMapping;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-30T15:07:41+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class UrlMapperImpl implements UrlMapper {

    @Override
    public UrlMappingResponse urlMappingToUrlMappingResponse(UrlMapping urlMapping) {
        if ( urlMapping == null ) {
            return null;
        }

        UrlMappingResponse.UrlMappingResponseBuilder urlMappingResponse = UrlMappingResponse.builder();

        urlMappingResponse.longUrl( urlMapping.getLongUrl() );
        urlMappingResponse.shortUrl( constructShortUrl( urlMapping.getShortCode() ) );
        urlMappingResponse.qrCodeData( urlMapping.getQrCodeData() );
        urlMappingResponse.createdAt( urlMapping.getCreatedAt() );
        urlMappingResponse.title( urlMapping.getTitle() );
        urlMappingResponse.id( urlMapping.getId() );

        return urlMappingResponse.build();
    }
}
