import axios from "axios";
import { forceLogout, isForceLogoutError } from "./forceLogout";
import i18n, { translateApiError, translateApiSuccess } from "../i18n";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const handleRefreshToken = async () => {
  const res = await instance.get("/api/v1/auth/refreshToken");
  if (res && res.data) {
    return res.data.accessToken;
  } else {
    return null;
  }
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }
    config.headers["Accept-Language"] = i18n.language === "en" ? "en" : "vi";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

const NO_RETRY_HEADER = "x-no-retry";

// Add a response interceptor (tự động dịch message thành công & lỗi tại 1 chỗ duy nhất)
instance.interceptors.response.use(
  function (response) {
    if (response?.data) {
      translateApiSuccess(response.data);
    }
    if (response.data && response.data.data) {
      return response.data;
    }
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response?.data) {
      translateApiError(error.response.data);
    }

    // Phiên bị vô hiệu (đăng nhập ở trình duyệt khác / đổi mật khẩu):
    // xử lý trước bước refresh token vì refresh cũng sẽ thất bại.
    const errorCode = error.response?.data?.error;
    if (error.response?.status === 401 && isForceLogoutError(errorCode)) {
      forceLogout(errorCode);
      return Promise.reject(error);
    }

    if (
      originalRequest &&
      error.response?.status === 401 &&
      originalRequest.url !== "/api/v1/auth/refreshToken" &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest.headers[NO_RETRY_HEADER] = "true";

      try {
        const accessToken = await handleRefreshToken();

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return instance.request(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
