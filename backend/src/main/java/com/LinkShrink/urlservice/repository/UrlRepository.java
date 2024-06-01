package com.LinkShrink.urlservice.repository;

import com.LinkShrink.urlservice.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<UrlMapping, Long> {
    boolean existsByShortCode(String shortCode);
    boolean existsByLongUrl(String longUrl);
    Optional<UrlMapping> findByShortCode(String shortCode);
    List<UrlMapping> findAllByCreatedBy(Long createdBy);
}
