import axios from "axios";

const apiId = "4ilfli2w14";
export const baseURL = `https://d3hx4fc9ioxuzl.cloudfront.net/`;

const XSRF_TOKEN = "XSRF-TOKEN";
const REFRESH_TOKEN_ENDPOINT = "/auth/refreshToken";
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
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith("/api") || config.url?.startsWith("/auth")) {
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
