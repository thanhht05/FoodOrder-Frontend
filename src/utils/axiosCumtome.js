import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,

  //   timeout: 1000,
  //   headers: { "X-Custom-Header": "foobar" },
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
    return config;
  },
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  },
);
const NO_RETRY_HEADER = "x-no-retry";
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.data && response.data.data) {
      return response.data;
    }
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

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

          originalRequest.headers.Authorization =
            `Bearer ${accessToken}`;

          return instance.request(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");



        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
// instance.interceptors.response.use(
//   (response) => {
//     return {
//       success: true,
//       data: response.data,
//     };
//   },
//   (error) => {
//     return {
//       success: false,
//       data: error.response?.data,
//       message: error.response?.data?.message,
//       status: error.response?.status,
//     };
//   }
// );
// const res = await callCreateAUser(...);

// if (res.success) {
//   message.success("Create a user successfully");
// } else {
//   notification.error({
//     message: "Create user failed",
//     description: res.message,
//   });
// }
export default instance;
