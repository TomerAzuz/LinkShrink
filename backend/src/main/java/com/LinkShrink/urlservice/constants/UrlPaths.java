package com.LinkShrink.urlservice.constants;

public class UrlPaths {
    public static final String API_V1 = "/api/v1";
    public static final String SHORTCODE = "/{shortCode:[a-zA-Z0-9]{6}}";
    public static final String API_V1_URL = API_V1 + "/url";
    public static final String API_V1_AUTH = API_V1 + "/auth";
    public static final String API_V1_ANALYTICS = API_V1 + "/analytics";
    public static final String API_V1_USERS = API_V1 + "/users";

    /* URL */
    public static final String SHORTEN = "/shorten";
    public static final String MY_LINKS = "/mylinks";
    public static final String URL_ID = "/{urlId}";
    public static final String REPORT = "/report";
    public static final String UNSHORTEN = "/unshorten";

    /* Authentication */
    public static final String SIGNUP = "/signup";
    public static final String LOGIN = "/login";
    public static final String REFRESH_TOKEN = "/refresh";
    public static final String CODE = "/{code}";
    public static final String ACTIVATE_CODE = "/activate" + CODE;
    public static final String FORGOT_EMAIL = "/forgot/{email}";
    public static final String VERIFY_CODE = "/verify" + CODE;
    public static final String RESET = "/reset";

    /* Users */
    public static final String ME = "/me";

    /* External */
    public static final String IP_API_URL = "http://ip-api.com/json/";
}
