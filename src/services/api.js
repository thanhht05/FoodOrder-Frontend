import axios from "../utils/axiosCumtome";

export const callRegister = (email, fullName, phone, password) => {
  const URL = "/api/v1/auth/register";
  const data = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
    role: {
      id: 2,
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
export const callUpdateAUser = (id, fullName, phone, point) => {
  const URL = "/api/v1/users";
  const data = {
    id,
    fullName,
    phone,
    point,
  };
  return axios.put(URL, data);
};
export const callDeleteUser = (userId) => {
  const URL = `/api/v1/users/${userId}`;

  return axios.delete(URL);
};
export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/users/bulk", data);
};

export const callFetchAllProcut = (query) => {
  return axios.get(`/api/v1/products?${query}`);
};

export const callFetchAllCategory = () => {
  return axios.get("/api/v1/categories");
};
export const callUploadProductImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const callCreateProduct = (
  name,
  price,
  quantity,
  lstImg,
  categoryName,
  description,
) => {
  const URL = "/api/v1/products";
  const data = {
    name,
    price,
    quantity,
    lstImg,
    categoryName,
    description,
  };
  return axios.post(URL, data);
};

export const callDeleteProduct = (id) => {
  return axios.delete(`/api/v1/products/${id}`);
};

export const calUpdateProduct = (
  id,
  name,
  price,
  quantity,
  lstImg,
  categoryName,
  description,
) => {
  const URL = "/api/v1/products";
  const data = {
    id,
    name,
    price,
    quantity,
    lstImg,
    categoryName,
    description,
  };
  return axios.put(URL, data);
};

export const callFetchProductId = (id) => {
  const URL = `/api/v1/products/${id}`;
  return axios.get(URL);
};

export const callFetchTable = (query) => {
  const URL = `/api/v1/bookingTables?${query}`;
  return axios.get(URL);
};
export const callFetchTableByName = (tableName) => {
  const URL = `/api/v1/bookingTables/search?tableName=${tableName}`;
  return axios.get(URL);
};

export const callPlaceAnOrder = (
  cartDetailIds,
  tableId,
  paymentMethod,
  note,
) => {
  const URL = "/api/v1/orders/placeOrder";
  const data = {
    cartDetailIds,
    tableId,
    paymentMethod,
    note,
  };
  return axios.post(URL, data);
};

export const callFetchCardetails = () => {
  return axios.get("/api/v1/cartDetailUser");
};

export const callFetchOrderHistory = () => {
  return axios.get("/api/v1/orderHistory");
};

export const callBuyNowItem = (
  productId,
  quantity,
  price,
  paymentMethod,
  tableId,
) => {
  const URL = "/api/v1/orders/buy-now";

  const data = {
    productId,
    quantity,
    price,
    paymentMethod,
    tableId,
  };
  return axios.post(URL, data);
};

export const callFetchOrders = (query = "") => {
  return axios.get(`/api/v1/orders${query}`);
};

export const callFetchOrderDetails = (orderId) => {
  return axios.get(`/api/v1/orderDetails/${orderId}`);
};

export const callUpdateOrderStatus = (id, orderStatus) => {
  const URL = "/api/v1/orders";
  const data = {
    id,
    orderStatus
  };
  return axios.put(URL, data);
};

export const callPayOrder = () => {
  return axios.post(`/api/v1/orders/pay`);
};

export const callChatAI = (message) => {
  return axios.post('/api/v1/ai/chat', { message });
};

export const callChangePassword = (oldPassword, newPassword, confirmPassword) => {
  const URL = "/api/v1/auth/changePassword";
  const data = {
    oldPassword,
    newPassword,
    confirmPassword,
  };
  return axios.post(URL, data);
};

export const callCreateConversation = () => {
  return axios.post('/api/v1/conversations');
};

export const callFetchAdminMessages = (conversationId) => {
  return axios.get(`/api/v1/conversations/${conversationId}/messages`);
};

export const callFetchAllConversations = () => {
  return axios.get('/api/v1/conversations');
};

export const callCloseConversation = (conversationId) => {
  return axios.put(`/api/v1/conversations/${conversationId}`);
};
