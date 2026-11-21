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

  // 1. Check loading state first
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

  // 2. Check authentication status
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Check role authorization
  if (roles && !roles.includes(userRole)) {
    return <NotPermitted />;
  }

  // 4. Authorized: render child components
  return <>{children}</>;
};

export default ProtectedRoute;