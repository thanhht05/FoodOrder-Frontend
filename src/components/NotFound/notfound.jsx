import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button onClick={() => navigate("/")} type="primary">
          Về trang chủ
        </Button>
      }
    />
  );
};
export default NotFound;
