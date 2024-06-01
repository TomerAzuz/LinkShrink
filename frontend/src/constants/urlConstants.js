export const BASE_URL = "http://localhost:5173";
export const API_BASE_URL = BASE_URL + "/api/v1";

/* Authentication */
export const AUTH_LOGIN = "/auth/login";
export const AUTH_SIGNUP = "/auth/signup";
export const AUTH_ACTIVATE = "/auth/activate";
export const AUTH_FORGOT = "/auth/forgot";
export const AUTH_VERIFY_CODE = "/auth/verify";
export const AUTH_PWD_RESET = "/auth/reset";

/* Users */
export const USERS_ME = "/users/me";
export const USERS_ALL = "/users";

/* URL service */
export const URL_SHORTEN = "/url/shorten";
export const URL_MYLINKS = "/url/mylinks";
export const URL_UNSHORTEN = "/url/unshorten";
export const URL_REPORT = "/url/report";