import { Modal } from "antd";
import i18n from "../i18n";

// Backend error code in 401 response error field
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

// Prevent multiple modals when concurrent requests get 401
let isHandling = false;

/**
 * Force logout: clear tokens, show localized modal, redirect to /login.
 * Uses window.location to cleanly reset Redux state and terminate WebSocket connections.
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
