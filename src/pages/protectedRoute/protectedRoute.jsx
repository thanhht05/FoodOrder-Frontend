import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotPermitted from "./notPermitted";
import { Spin } from "antd";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const userRole = user?.role?.name;
  const isLoading = useSelector((state) => state.account.isLoading);

  // 1. Ưu tiên kiểm tra trạng thái đang tải dữ liệu trước
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

  // 2. Kiểm tra xem đã đăng nhập chưa
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Kiểm tra quyền hạn (Role)
  if (roles && !roles.includes(userRole)) {
    return <NotPermitted />;
  }

  // 4. Hợp lệ -> Render component con
  return <>{children}</>;
};

export default ProtectedRoute;