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
      message.success("Cập nhật user thành công");
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
        title="Update user"
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
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="FullName"
            rules={[{ required: true, message: "Please input fullName!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
            name="point"
            label="Point"
            rules={[
              { required: true, message: "Please enter point" },
              {
                type: "number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input phone!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserModalUpdate;
