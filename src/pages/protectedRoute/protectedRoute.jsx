import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotPermitted from "./notPermitted";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const userRole = user?.role?.name;
  const isLoading = useSelector((state) => state.account.isLoading); // Lấy thêm isLoading

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }
  // chưa login → đá về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  //  có yêu cầu role nhưng không đủ quyền
  if (roles && !roles.includes(userRole)) {
    return <NotPermitted />;
  }

  //  hợp lệ
  return <>{children}</>;
};

export default ProtectedRoute;
