import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";

const NotPermitted = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Result
      status="403"
      title="403"
      subTitle={t("notPermitted.subTitle")}
      extra={
        <Button onClick={() => navigate("/")} type="primary">
          {t("notPermitted.backHome")}
        </Button>
      }
    />
  );
};
export default NotPermitted;
