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
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";
      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`;

        localStorage.setItem("access_token", access_token);
        return instance.request(error.config);
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/api/v1/auth/refreshToken"
    ) {
      if (window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
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
