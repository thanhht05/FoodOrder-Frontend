import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t("notFound.subTitle")}
      extra={
        <Button onClick={() => navigate("/")} type="primary">
          {t("notFound.backHome")}
        </Button>
      }
    />
  );
};
export default NotFound;
