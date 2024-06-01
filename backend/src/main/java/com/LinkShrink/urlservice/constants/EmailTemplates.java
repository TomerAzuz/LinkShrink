package com.LinkShrink.urlservice.constants;

public class EmailTemplates {
    public static final String PASSWORD_RESET_TEMPLATE = "<p>Dear %s,</p>"
            + "<p>You have requested to reset your password. Please use the following temporary password to log in and reset your password:</p>"
            + "<p><strong>Temporary Password: %s</strong></p>"
            + "<p>Best regards,<br>LinkShrink</p>";

    public static final String ACCOUNT_ACTIVATION_TEMPLATE = "<p>Dear %s,</p>"
            + "<p>Thank you for registering with LinkShrink. Please use the following code to activate your account:</p>"
            + "<p><strong>Activation Code: %s</strong></p>"
            + "<p>Best regards,<br>LinkShrink</p>";

    public static final String MALICIOUS_URL_REPORT_TEMPLATE = "<p>Dear Admin,</p>"
            + "<p>The user %s has reported the following URL as malicious:</p>"
            + "<p><strong>Reported URL: %s</strong></p>"
            + "<p>Please review this URL as soon as possible.</p>"
            + "<p>Best regards,<br>LinkShrink</p>";
}
