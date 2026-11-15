import { Modal } from "antd";
import i18n from "../i18n";

// Mã lỗi backend trả về trong trường "error" của response 401
export const AUTH_ERROR = {
  LOGGED_IN_ELSEWHERE: "ERR_LOGGED_IN_ELSEWHERE",
  PASSWORD_CHANGED: "ERR_PASSWORD_CHANGED",
};

export const isForceLogoutError = (code) =>
  code === AUTH_ERROR.LOGGED_IN_ELSEWHERE || code === AUTH_ERROR.PASSWORD_CHANGED;

const getForceLogoutMessage = (code) => {
  const targetCode = isForceLogoutError(code)
    ? code
    : AUTH_ERROR.LOGGED_IN_ELSEWHERE;
  return {
    title: i18n.t(`apiError.${targetCode}_TITLE`),
    content: i18n.t(`apiError.${targetCode}`),
  };
};

// Chặn mở nhiều modal khi nhiều request cùng bị 401
let isHandling = false;

/**
 * Đăng xuất bắt buộc: xoá token, hiện thông báo (đã dịch theo vie.json / en.json), chuyển về /login.
 * Dùng window.location để reload sạch Redux state và đóng mọi kết nối WebSocket.
 */
export const forceLogout = (code) => {
  if (isHandling) return;
  isHandling = true;

  localStorage.removeItem("access_token");
  const { title, content } = getForceLogoutMessage(code);

  Modal.warning({
    title,
    content,
    okText: i18n.t("auth.reLoginBtn"),
    keyboard: false,
    maskClosable: false,
    onOk: () => {
      window.location.href = "/login";
    },
  });
};
