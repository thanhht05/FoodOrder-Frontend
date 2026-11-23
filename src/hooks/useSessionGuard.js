import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { callGetAccount } from "../services/api";

const SESSION_QUEUE = "/user/queue/session";

/**
 * Single active session: listen to user private channel.
 * When account logs in from another browser, backend sends SESSION_REPLACED.
 *
 * Verify with server via /auth/me instead of trusting message payload directly.
 * If session is superseded, axios interceptor catches 401 ERR_LOGGED_IN_ELSEWHERE
 * and triggers forceLogout() (shows notification and redirects to /login).
 */
const useSessionGuard = () => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const userId = useSelector((state) => state.account.user?.id);
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(import.meta.env.VITE_BACKEND_URL + "/ws"),
      reconnectDelay: 5000,
      // Retrieve latest token on every connect/reconnect in case access token was refreshed
      beforeConnect: () => {
        const token = localStorage.getItem("access_token") || "";
        client.connectHeaders = { Authorization: `Bearer ${token}` };
      },
      onConnect: () => {
        client.subscribe(SESSION_QUEUE, (msg) => {
          try {
            const data = JSON.parse(msg.body);
            if (data?.type === "SESSION_REPLACED") {
              // Verify with server; 401 errors are handled by axios interceptor
              callGetAccount().catch(() => {});
            }
          } catch {
            // Ignore invalid message
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
