import { useTranslation } from "../i18n";

const Contact = () => {
  const { t } = useTranslation();
  return <h1>{t("contact.pageTitle")}</h1>;
};
export default Contact;
