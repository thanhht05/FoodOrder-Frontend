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
