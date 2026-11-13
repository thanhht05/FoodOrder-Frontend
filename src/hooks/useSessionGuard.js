import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { callGetAccount } from "../services/api";

const SESSION_QUEUE = "/user/queue/session";

/**
 * Single active session: lắng nghe kênh riêng của user.
 * Khi tài khoản đăng nhập ở trình duyệt khác, backend gửi SESSION_REPLACED.
 *
 * Không tin trực tiếp nội dung tin nhắn: gọi lại /auth/me để server xác nhận.
 * Nếu phiên đã bị thay thế, axios interceptor nhận 401 ERR_LOGGED_IN_ELSEWHERE
 * và gọi forceLogout() (hiện thông báo + chuyển về /login).
 */
const useSessionGuard = () => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const userId = useSelector((state) => state.account.user?.id);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_BACKEND_URL + "/ws"),
      reconnectDelay: 5000,
      // Lấy token mới nhất mỗi lần (re)connect, vì access token có thể đã được refresh
      beforeConnect: () => {
        const token = localStorage.getItem("access_token") || "";
        client.connectHeaders = { Authorization: `Bearer ${token}` };
      },
      onConnect: () => {
        client.subscribe(SESSION_QUEUE, (msg) => {
          try {
            const data = JSON.parse(msg.body);
            if (data?.type === "SESSION_REPLACED") {
              // Xác nhận với server; lỗi 401 được xử lý tại axios interceptor
              callGetAccount().catch(() => {});
            }
          } catch {
            // bỏ qua tin nhắn không hợp lệ
          }
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [isAuthenticated, userId]);
};

export default useSessionGuard;

