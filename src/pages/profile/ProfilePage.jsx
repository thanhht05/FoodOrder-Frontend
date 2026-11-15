import React from "react";
import { Tabs, Form, Input, Button, message } from "antd";
import { callChangePassword } from "../../services/api";
import "./ProfilePage.scss";
import { useTranslation } from "../../i18n";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinishChangePassword = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error(t("profile.confirmPasswordMismatch"));
      return;
    }

    try {
      const res = await callChangePassword(oldPassword, newPassword, confirmPassword);
      if (res && res.data) {
        message.success(res.message || t("profile.changePasswordSuccess"));
        form.resetFields();
      } else {
        message.error(res?.message || t("common.errorTitle"));
      }
    } catch (error) {
      message.error(error?.response?.data?.message || t("profile.changePasswordFailed"));
    }
  };

  const items = [
    {
      key: "1",
      label: t("profile.tabPersonalInfo"),
      children: (
        <div className="user-info-placeholder">
          <h3>{t("profile.tabPersonalInfo")}</h3>
          <p>{t("profile.featureDeveloping")}</p>
        </div>
      ),
    },
    {
      key: "2",
      label: t("profile.tabChangePassword"),
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
              label={t("profile.currentPasswordLabel")}
              name="oldPassword"
              rules={[{ required: true, message: t("profile.currentPasswordRequired") }]}
            >
              <Input.Password placeholder={t("profile.currentPasswordPlaceholder")} />
            </Form.Item>

            <Form.Item
              label={t("profile.newPasswordLabel")}
              name="newPassword"
              rules={[
                { required: true, message: t("profile.newPasswordRequired") },
                { min: 6, message: t("profile.newPasswordMin") }
              ]}
            >
              <Input.Password placeholder={t("profile.newPasswordPlaceholder")} />
            </Form.Item>

            <Form.Item
              label={t("profile.confirmPasswordLabel")}
              name="confirmPassword"
              rules={[
                { required: true, message: t("profile.confirmPasswordRequired") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("profile.confirmPasswordMismatch")));
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t("profile.confirmPasswordPlaceholder")} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t("profile.updatePasswordBtn")}
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
