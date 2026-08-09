import React from "react";
import { Tabs, Form, Input, Button, message } from "antd";
import { callChangePassword } from "../../services/api";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const [form] = Form.useForm();

  const onFinishChangePassword = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const res = await callChangePassword(oldPassword, newPassword, confirmPassword);
      if (res && res.data) {
        message.success("Đổi mật khẩu thành công!");
        form.resetFields();
      } else {
        message.error(res?.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Đổi mật khẩu thất bại. Vui lòng thử lại!");
    }
  };

  const items = [
    {
      key: "1",
      label: "Thông tin người dùng",
      children: (
        <div className="user-info-placeholder">
          <h3>Thông tin cá nhân</h3>
          <p>Tính năng đang được phát triển...</p>
        </div>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <div className="change-password-container">
          <Form
            form={form}
            name="changePasswordForm"
            layout="vertical"
            onFinish={onFinishChangePassword}
            autoComplete="off"
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="oldPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
            >
              <Input.Password placeholder="Mật khẩu hiện tại" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
              ]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-container">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default ProfilePage;
