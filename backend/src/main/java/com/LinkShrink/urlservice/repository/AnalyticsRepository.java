package com.LinkShrink.urlservice.repository;

import com.LinkShrink.urlservice.model.UrlAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<UrlAnalytics, Long> {

    List<UrlAnalytics> findByUrlMappingIdAndUrlMapping_CreatedBy(Long urlMappingId, Long userId);
    List<UrlAnalytics> findAllByUrlMapping_CreatedBy(Long userId);
}
