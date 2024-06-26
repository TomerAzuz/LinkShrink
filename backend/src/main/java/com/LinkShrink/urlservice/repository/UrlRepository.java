package com.LinkShrink.urlservice.repository;

import com.LinkShrink.urlservice.model.UrlMapping;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<UrlMapping, Long> {
    boolean existsByShortCode(String shortCode);

    @Cacheable(value = "urlMappings", key = "#shortCode")
    Optional<UrlMapping> findByShortCode(String shortCode);

    Page<UrlMapping> findAllByCreatedBy(Long createdBy, Pageable pageable);
}
