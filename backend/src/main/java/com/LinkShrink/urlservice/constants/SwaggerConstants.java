package com.LinkShrink.urlservice.constants;

public class SwaggerConstants {

    /* URL */
    public static final String SUMMARY_SHORTEN = "Shorten a long URL.";
    public static final String DESC_SHORTEN = "Creates a shortened version (short code)" +
            "for the provided long URL in the request body (UrlDto).";
    public static final String SUMMARY_MYLINKS = "Retrieve all shortened URLs for the current user.";
    public static final String DESC_MYLINKS = "Returns a paginated list (Iterable<UrlMappingResponse>) of shortened URLs (short codes and details) " +
            "associated with the authenticated user.";
    public static final String SUMMARY_DELETE_URL = "Delete a shortened URL.";
    public static final String DESC_DELETE_URL = "Removes the shortened URL mapping identified by the provided urlId from the user's account.";
    public static final String SUMMARY_REPORT = "Report a malicious URL.";
    public static final String DESC_REPORT = "Flags a provided URL (UrlDto) as potentially malicious. Triggers a notification email.";
    public static final String SUMMARY_UNSHORTEN = "Get the original URL from a shortened code.";
    public static final String DESC_UNSHORTEN = "Returns the original long URL associated with the provided shortened code in the UrlDto request body.";


    /* Authentication */
    public static final String SUMMARY_SIGNUP = "Register a new user.";
    public static final String DESC_SIGNUP = "Creates a new user account with the provided information in the RegistrationRequest object. Sends a confirmation email.";
    public static final String SUMMARY_AUTH = "Authenticate a user.";
    public static final String DESC_AUTH = "Attempts to log in a user using the credentials provided in the LoginRequest object. " +
                                            "Returns a successful login response with an authentication token upon successful login.";
    public static final String SUMMARY_REFRESH = "Refresh an expired authentication token.";
    public static final String DESC_REFRESH = "Generates a new access token for the user using the provided refresh token " +
                                                "in the RefreshTokenRequest object.";
    public static final String SUMMARY_ACTIVATE = "Activate a new user account.";
    public static final String DESC_ACTIVATE = "Activates a user account using the activation code provided in the URL path ({code})";
    public static final String SUMMARY_FORGOT = "Initiate password reset process.";
    public static final String DESC_FORGOT =  "Sends a password reset code to the provided email address ({email}) if the user exists.";
    public static final String SUMMARY_VERIFY = "Verify password reset code.";
    public static final String DESC_VERIFY = "Verifies the provided reset code ({code}) to confirm password reset eligibility.";
    public static final String SUMMARY_RESET = "Reset user password.";
    public static final String DESC_RESET = "Resets the user's password using the provided information in the PasswordResetRequest object.";


    /* Analytics */
    public static final String SUMMARY_ANALYTICS_BY_ID = "Retrieves analytics data for a specific URL.";
    public static final String DESC_ANALYTICS_BY_ID = "Returns a list of UrlAnalytics objects, each representing analytics for a " +
                                                       "single access to the URL identified by the provided id (URL ID) in the path.";
    public static final String SUMMARY_ANALYTICS_ALL = "Retrieves all analytics data for the current user.";
    public static final String DESC_ANALYTICS_ALL = "Returns a list of UrlAnalytics objects encompassing all access analytics for all URLs shortened by the user.";


    /* Redirect */
    public static final String SUMMARY_REDIRECT = "Redirects to the original URL.";
    public static final String DESC_REDIRECT = "Attempts to find the original URL associated with the provided " +
                                                "short code ({shortCode}) in the path. If found, redirects the user to the original URL.";

    /* Users */
    public static final String SUMMARY_USERS_ME = "Get details of the currently authenticated user.";
    public static final String DESC_USERS_ME = "Returns a UserResponse object containing " +
            "information about the user who is currently logged in.";
    public static final String SUMMARY_USERS_ALL = "Get all users (admin access).";
    public static final String DESC_USERS_ALL = "Returns a list of UserResponse objects " +
            "containing information about all users in the system.";

}
