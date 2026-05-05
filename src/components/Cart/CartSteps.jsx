import { Steps } from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const CartSteps = () => {
  const location = useLocation();

  const getCurrentStep = () => {
    if (location.pathname.includes("checkout")) return 1;
    if (location.pathname.includes("success")) return 2;
    return 0;
  };

  return (
    <Steps
      size="small"
      current={getCurrentStep()}
      items={[
        { title: "Giỏ hàng", icon: <ShoppingCartOutlined /> },
        { title: "Thanh toán", icon: <CreditCardOutlined /> },
        { title: "Hoàn tất", icon: <CheckCircleOutlined /> },
      ]}
    />
  );
};

export default CartSteps;
