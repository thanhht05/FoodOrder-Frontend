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
const UserModalCreate = ({
  openModalCreateUser,
  setOpenModalCreateUser,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

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
        message.success("Tạo người dùng thành công");
        form.resetFields();
        setOpenModalCreateUser(false);
        await fetchUser();
      }
    } catch (error) {
      notification.error({
        message: "Tạo người dùng thất bại",
        description: error?.response?.data?.message || "Lỗi máy chủ",
      });
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm mới người dùng"
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
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserModalCreate;
