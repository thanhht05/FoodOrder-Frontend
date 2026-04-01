import axios from "../utils/axiosCumtome";

export const callRegister = (email, fullName, phone, password) => {
  const URL = "/api/v1/auth/register";
  const data = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
    role: {
      id: 1,
    },
  };
  return axios.post(URL, data);
};

export const callLogin = (username, password) => {
  const URL = "/api/v1/auth/login";
  const data = {
    username,
    password,
  };
  return axios.post(URL, data);
};

export const callGetAccount = () => {
  const URL = "/api/v1/auth/me";
  return axios.get(URL);
};

export const callLogout = () => {
  const URL = "/api/v1/auth/logout";
  return axios.post(URL);
};

export const callFetchAllUser = (query) => {
  const URL = `/api/v1/users?${query}`;
  return axios.get(URL);
};

export const callCreateAUser = (fullName, email, password, phone) => {
  const URL = "/api/v1/users";
  const data = {
    fullName,
    email,
    password,
    phone,
    role: {
      id: 1,
    },
  };
  return axios.post(URL, data);
};
