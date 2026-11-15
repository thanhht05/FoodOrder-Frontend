import { Divider, Form, Input, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateAUser } from "../../../services/api";
import { useTranslation } from "../../../i18n";

const UserModalUpdate = ({
  openModalUpdateUser,
  setOpenModalUpdateUser,
  userDataUpdate,
  setUserDataUpdate,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation();

  const handleCancel = () => {
    setOpenModalUpdateUser(false);
    setUserDataUpdate(null);
  };

  useEffect(() => {
    form.setFieldsValue(userDataUpdate);
  }, [userDataUpdate]);
  const onFinish = async (values) => {
    const { id, fullName, phone, point } = values;
    setIsSubmit(true);
    const res = await callUpdateAUser(id, fullName, phone, point);
    if (res && res.data) {
      message.success(res.message || t("admin.user.updateSuccess"));
      setOpenModalUpdateUser(false);
      await fetchUser();
    } else {
      notification.error({
        message: t("common.errorTitle"),
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title={t("admin.user.updateModalTitle")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpdateUser}
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
        okText={t("common.update")}
        cancelText={t("common.cancel")}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label={t("admin.user.colEmail")}
            rules={[{ required: true, message: t("auth.emailRequired") }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="fullName"
            label={t("admin.user.colFullName")}
            rules={[{ required: true, message: t("auth.fullNameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
            name="point"
            label={t("admin.user.pointLabel")}
            rules={[{ required: true, message: t("admin.user.pointRequired") }]}
          >
            <Input />
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
export default UserModalUpdate;
