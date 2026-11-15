import { Steps } from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../i18n";

const CartSteps = () => {
  const location = useLocation();
  const { t } = useTranslation();

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
        { title: t("cart.stepCart"), icon: <ShoppingCartOutlined /> },
        { title: t("cart.stepCheckout"), icon: <CreditCardOutlined /> },
        { title: t("cart.stepPayment"), icon: <CheckCircleOutlined /> },
      ]}
    />
  );
};

export default CartSteps;
