import axios from "axios";

const apiId = "s4g9m9o94d";
//s4g9m9o94d.execute-api.eu-central-1.amazonaws.com/prod/

const XSRF_TOKEN = "XSRF-TOKEN";
const REFRESH_TOKEN_ENDPOINT = "/api/auth/refreshToken";
const SIGN_IN_PATH = "/sign-in";

const getCookieByName = (name: string): string | undefined => {
  const cookies = document.cookie.split(";");

  const fullCookie: string | undefined = cookies.find((cookie) =>
    cookie.trim().startsWith(`${name}=`)
  );
  return fullCookie?.trim()?.substring(name.length + 1, fullCookie.length);
};

const getCsrfHeader = (): string | undefined => getCookieByName(XSRF_TOKEN);

const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use(
  (config) => {
    if (["api", "auth"].some((endpoint) => config.url?.startsWith(`/${endpoint}`))) {
      config.headers[XSRF_TOKEN] = getCsrfHeader();
    }
    return config;
  },
  () => console.log("Error in request interceptor")
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message.includes("token has expired")
    ) {
      return api
        .get(REFRESH_TOKEN_ENDPOINT)
        .then((response) => {
          if (response.data.success) return api(originalRequest);
          window.location.href = SIGN_IN_PATH;
        })
        .catch(() => {
          window.location.href = SIGN_IN_PATH;
        });
    }
    if (
      error.response.status === 503 &&
      error.response?.data.includes("CloudFront distribution was throttled")
    ) {
      // sleep for 3 second and try again
      return new Promise((resolve) => {
        setTimeout(() => resolve(api(originalRequest)), 3000);
      });
    }
    return Promise.reject(error);
  }
);

export default api;