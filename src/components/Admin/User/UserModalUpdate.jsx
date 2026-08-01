import { Divider, Form, Input, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateAUser } from "../../../services/api";

const UserModalUpdate = ({
  openModalUpdateUser,
  setOpenModalUpdateUser,
  userDataUpdate,
  setUserDataUpdate,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

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
      message.success("Cập nhật người dùng thành công");
      setOpenModalUpdateUser(false);
      await fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpdateUser}
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
        okText={"Cập nhật"}
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
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
            name="point"
            label="Điểm"
            rules={[{ required: true, message: "Vui lòng nhập điểm" }]}
          >
            <Input />
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
export default UserModalUpdate;
