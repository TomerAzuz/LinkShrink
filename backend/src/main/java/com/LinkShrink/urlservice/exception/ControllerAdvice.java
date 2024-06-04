package com.LinkShrink.urlservice.exception;

import com.LinkShrink.urlservice.dto.ErrorResponse;
import com.LinkShrink.urlservice.exception.AuthExceptions.EmailExistsException;
import com.LinkShrink.urlservice.exception.AuthExceptions.InvalidCodeException;
import com.LinkShrink.urlservice.exception.AuthExceptions.PasswordConfirmationException;
import com.LinkShrink.urlservice.exception.AuthExceptions.UserNotAuthenticatedException;
import com.LinkShrink.urlservice.exception.UrlExceptions.InvalidUrlException;
import com.LinkShrink.urlservice.exception.UrlExceptions.UrlMappingNotFoundException;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
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
    private static final Logger log = LoggerFactory.getLogger(ControllerAdvice.class);

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
        put(PasswordConfirmationException.class, HttpStatus.BAD_REQUEST);
        put(InvalidUrlException.class, HttpStatus.BAD_REQUEST);

        put(InvalidCodeException.class, HttpStatus.UNAUTHORIZED);
        put(SignatureException.class, HttpStatus.UNAUTHORIZED);
        put(ExpiredJwtException.class, HttpStatus.UNAUTHORIZED);
        put(UserNotAuthenticatedException.class, HttpStatus.UNAUTHORIZED);
        put(InvalidBearerTokenException.class, HttpStatus.UNAUTHORIZED);
        put(BadCredentialsException.class, HttpStatus.UNAUTHORIZED);

        put(AccountStatusException.class, HttpStatus.FORBIDDEN);
        put(AccessDeniedException.class, HttpStatus.FORBIDDEN);

        put(UrlMappingNotFoundException.class, HttpStatus.NOT_FOUND);
        put(UsernameNotFoundException.class, HttpStatus.NOT_FOUND);

        put(EmailExistsException.class, HttpStatus.CONFLICT);

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
        ErrorResponse errorResponse = createErrorResponse(status, ex, request);
        logError(errorResponse);
        return errorResponse;
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

    private void logError(ErrorResponse errorResponse) {
        log.error("{}: {} Error: {} message: {} path = {}",
                errorResponse.getTimestamp().toString(),
                errorResponse.getStatus(),
                errorResponse.getError(),
                errorResponse.getMessage(),
                errorResponse.getPath());
    }
}
