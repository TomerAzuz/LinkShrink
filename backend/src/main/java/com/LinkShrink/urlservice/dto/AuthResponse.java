package com.LinkShrink.urlservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthResponse {
    private String token;
    private long expiresIn;
    private String fullName;
    private String email;
}
