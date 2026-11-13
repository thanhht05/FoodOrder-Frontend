import { Modal } from "antd";

// Mã lỗi backend trả về trong trường "error" của response 401
export const AUTH_ERROR = {
  LOGGED_IN_ELSEWHERE: "ERR_LOGGED_IN_ELSEWHERE",
  PASSWORD_CHANGED: "ERR_PASSWORD_CHANGED",
};

const MESSAGES = {
  [AUTH_ERROR.LOGGED_IN_ELSEWHERE]: {
    title: "Phiên đăng nhập đã kết thúc",
    content:
      "Tài khoản của bạn vừa được đăng nhập ở một trình duyệt khác. Vui lòng đăng nhập lại nếu muốn tiếp tục.",
  },
  [AUTH_ERROR.PASSWORD_CHANGED]: {
    title: "Mật khẩu đã thay đổi",
    content: "Mật khẩu tài khoản của bạn đã được thay đổi. Vui lòng đăng nhập lại.",
  },
};

export const isForceLogoutError = (code) => Boolean(MESSAGES[code]);

// Chặn mở nhiều modal khi nhiều request cùng bị 401
let isHandling = false;

/**
 * Đăng xuất bắt buộc: xoá token, hiện thông báo, chuyển về /login.
 * Dùng window.location để reload sạch Redux state và đóng mọi kết nối WebSocket.
 */
export const forceLogout = (code) => {
  if (isHandling) return;
  isHandling = true;

  localStorage.removeItem("access_token");
  const { title, content } = MESSAGES[code] || MESSAGES[AUTH_ERROR.LOGGED_IN_ELSEWHERE];

  Modal.warning({
    title,
    content,
    okText: "Đăng nhập lại",
    keyboard: false,
    maskClosable: false,
    onOk: () => {
      window.location.href = "/login";
    },
  });
};

