import { useTranslation } from "../../i18n";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("footer.contactTitle")}</h1>
    </>
  );
};
export default Footer;
