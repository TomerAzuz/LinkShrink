package com.LinkShrink.urlservice.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitingInterceptor implements HandlerInterceptor {

    private final Bucket bucket;

    public RateLimitingInterceptor() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder().addLimit(limit).build();
    }

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler) throws IOException {
        if (bucket.tryConsume(1)) {
            return true;
        } else {
            int status = HttpStatus.TOO_MANY_REQUESTS.value();
            response.setStatus(status);
            response.sendRedirect("/app/error/" + status);
            return false;
        }
    }
}
