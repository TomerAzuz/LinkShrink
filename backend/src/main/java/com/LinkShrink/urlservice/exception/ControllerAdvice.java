package com.LinkShrink.urlservice.exception;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.exception.AuthExceptions.EmailExistsException;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidUrlException;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.mail.MessagingException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;
import java.security.SignatureException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class ControllerAdvice {

    private ErrorResponse createErrorResponse(HttpStatus status, Exception ex, WebRequest request) {
        return new ErrorResponse(
                new Date(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false)
        );
    }

    private final Map<Class<? extends Exception>, HttpStatus> exceptionStatusMap = new HashMap<>() {{
        put(InvalidUrlException.class, HttpStatus.BAD_REQUEST);
        put(InvalidCodeException.class, HttpStatus.BAD_REQUEST);
        put(UrlMappingNotFoundException.class, HttpStatus.NOT_FOUND);
        put(UsernameNotFoundException.class, HttpStatus.NOT_FOUND);
        put(BadCredentialsException.class, HttpStatus.UNAUTHORIZED);
        put(EmailExistsException.class, HttpStatus.BAD_REQUEST);
        put(AccountStatusException.class, HttpStatus.FORBIDDEN);
        put(AccessDeniedException.class, HttpStatus.FORBIDDEN);
        put(SignatureException.class, HttpStatus.FORBIDDEN);
        put(ExpiredJwtException.class, HttpStatus.FORBIDDEN);
        put(MessagingException.class, HttpStatus.INTERNAL_SERVER_ERROR);
        put(Exception.class, HttpStatus.INTERNAL_SERVER_ERROR);
    }};

    @ExceptionHandler({
            InvalidUrlException.class,
            InvalidCodeException.class,
            UrlMappingNotFoundException.class,
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            EmailExistsException.class,
            AccountStatusException.class,
            AccessDeniedException.class,
            SignatureException.class,
            ExpiredJwtException.class,
            MessagingException.class,
            Exception.class
    })
    @ResponseStatus
    public ErrorResponse handleException(Exception ex, WebRequest request) {
        HttpStatus status = exceptionStatusMap.getOrDefault(ex.getClass(), HttpStatus.INTERNAL_SERVER_ERROR);
        return createErrorResponse(status, ex, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        String errorMessage = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("Validation error");

        return new ErrorResponse(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                errorMessage,
                request.getDescription(false)
        );
    }
}
