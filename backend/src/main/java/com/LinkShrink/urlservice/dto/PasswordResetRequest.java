package com.LinkShrink.urlservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordResetRequest {
    @Email
    private String email;

    @Size(min = 8, max = 16, message =
            "Invalid password. Password must contain between 8 to 16 characters.")
    private String password;

    @Size(min = 8, max = 16, message =
            "Invalid password. Password must contain between 8 to 16 characters.")
    private String confirmPassword;
}
