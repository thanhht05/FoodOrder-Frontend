import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
} from "antd";
import { callCreateAUser } from "../../../services/api";
import { useState } from "react";
import { useTranslation } from "../../../i18n";
const UserModalCreate = ({
  openModalCreateUser,
  setOpenModalCreateUser,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation();

  const showModal = () => {
    setOpenModalCreateUser(true);
  };

  const handleCancel = () => {
    setOpenModalCreateUser(false);
  };
  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);

    try {
      const res = await callCreateAUser(fullName, email, password, phone);

      if (res && res.data) {
        message.success(res.message || t("admin.user.createSuccess"));
        form.resetFields();
        setOpenModalCreateUser(false);
        await fetchUser();
      }
    } catch (error) {
      notification.error({
        message: t("common.errorTitle"),
        description: error?.response?.data?.message || t("apiError.ERR_INTERNAL_SERVER"),
      });
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        {t("common.add")}
      </Button>
      <Modal
        title={t("admin.user.createModalTitle")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalCreateUser}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item
            name="email"
            label={t("admin.user.colEmail")}
            rules={[{ required: true, message: t("auth.emailRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label={t("admin.user.colFullName")}
            rules={[{ required: true, message: t("auth.fullNameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={t("admin.user.passwordLabel")}
            rules={[{ required: true, message: t("admin.user.passwordRequired") }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t("admin.user.colPhone")}
            rules={[{ required: true, message: t("auth.phoneRequired") }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserModalCreate;
