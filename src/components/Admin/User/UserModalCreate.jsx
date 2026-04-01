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
const UserModalCreate = ({
  openModalCreateUser,
  setOpenModalCreateUser,
  fetchUser,
}) => {
  const [form] = Form.useForm();
  const showModal = () => {
    setOpenModalCreateUser(true);
  };

  const handleCancel = () => {
    setOpenModalCreateUser(false);
  };
  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;

    const res = await callCreateAUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Create a user successfully");
      form.resetFields();
      setOpenModalCreateUser(false);
      await fetchUser();
    } else {
      notification.error({
        message: "Create user have an error",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalCreateUser}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
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
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password />
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
export default UserModalCreate;
