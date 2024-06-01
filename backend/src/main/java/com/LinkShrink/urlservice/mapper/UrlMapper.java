package com.LinkShrink.urlservice.mapper;

import com.LinkShrink.urlservice.dto.UrlMappingResponse;
import com.LinkShrink.urlservice.model.UrlMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UrlMapper {

    @Mapping(source = "longUrl", target = "longUrl")
    @Mapping(source = "shortCode", target = "shortUrl", qualifiedByName = "constructShortUrl")
    @Mapping(source = "qrCodeData", target = "qrCodeData")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "title", target = "title")
    UrlMappingResponse urlMappingToUrlMappingResponse(UrlMapping urlMapping);

    @Named("constructShortUrl")
    default String constructShortUrl(String shortCode) {
        String baseUrl = "http://localhost:9000";
        return baseUrl + "/" + shortCode;
    }
}


