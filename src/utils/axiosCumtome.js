import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  //   timeout: 1000,
  //   headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("accessToken")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("accessToken");
    }
    return config;
  },
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.data && response.data.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    if (error.response && error.response.data) {
      return Promise.reject(error); // catch error
    }
    return Promise.reject(error);
  },
);
export default instance;
