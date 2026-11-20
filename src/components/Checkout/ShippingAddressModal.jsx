import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Button, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../../i18n";

const ShippingAddressModal = ({ open, onCancel, onSave, initialAddress }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Fetch danh sách tỉnh thành khi mở modal (hoàn toàn bất đồng bộ, không setState đồng bộ trong effect)
  useEffect(() => {
    if (!open) return;

    let isSubscribed = true;

    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then((data) => {
        if (!isSubscribed) return;
        const list = data || [];
        setProvinces(list);

        // Nếu đang sửa địa chỉ đã có sẵn Tỉnh/Thành, tự động nạp danh sách Phường/Xã
        if (initialAddress?.province) {
          const found = list.find((p) => p.name === initialAddress.province);
          if (found?.code) {
            fetch(
              `https://provinces.open-api.vn/api/v2/p/${found.code}?depth=2`,
            )
              .then((r) => r.json())
              .then((wData) => {
                if (isSubscribed) {
                  setWards(wData.wards || []);
                }
              })
              .catch((err) => console.error(err));
          }
        }
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error("Lỗi khi tải danh sách tỉnh thành:", err);
        message.error("Không thể tải danh sách tỉnh thành, vui lòng thử lại.");
      });

    return () => {
      isSubscribed = false;
    };
  }, [open, initialAddress]);

  // Cập nhật giá trị Form sau khi Modal mở (dùng afterOpenChange thay vì setState trong effect)
  const handleAfterOpenChange = (isOpen) => {
    if (isOpen) {
      if (initialAddress) {
        form.setFieldsValue({
          recipientName: initialAddress.recipientName,
          phone: initialAddress.phone,
          province: initialAddress.province,
          ward: initialAddress.ward,
          addressDetail: initialAddress.addressDetail,
        });
      } else {
        form.resetFields();
        setWards([]);
      }
    }
  };

  const handleProvinceChange = (value, option) => {
    form.setFieldsValue({ ward: undefined });
    setWards([]);
    if (option?.key) {
      setLoadingWards(true);
      fetch(`https://provinces.open-api.vn/api/v2/p/${option.key}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []))
        .catch((err) => console.error(err))
        .finally(() => setLoadingWards(false));
    }
  };

  const handleFinish = (values) => {
    const selectedProvince = provinces.find((p) => p.name === values.province);
    onSave({
      recipientName: values.recipientName.trim(),
      phone: values.phone.trim(),
      province: values.province,
      provinceCode: selectedProvince?.code,
      ward: values.ward,
      addressDetail: values.addressDetail.trim(),
    });
    message.success(t("checkout.addressSavedSuccess"));
  };

  const handleCancel = () => {
    form.resetFields();
    setWards([]);
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={
        <span>
          <EnvironmentOutlined
            style={{ color: "var(--color-primary, #f97316)" }}
          />{" "}
          {initialAddress
            ? t("checkout.editShippingAddress")
            : t("checkout.addShippingAddress")}
        </span>
      }
      onCancel={handleCancel}
      afterOpenChange={handleAfterOpenChange}
      footer={null}
      destroyOnClose
      centered
      className="shipping-modal"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="recipientName"
              label={t("checkout.recipientNameLabel")}
              rules={[
                {
                  required: true,
                  message: t("checkout.recipientNameRequired"),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                placeholder={t("checkout.recipientNamePlaceholder")}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label={t("checkout.phoneLabel")}
              rules={[
                {
                  required: true,
                  message: t("checkout.phoneRequired"),
                },
                {
                  pattern: /(0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: t("checkout.phoneInvalid"),
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />}
                placeholder={t("checkout.phonePlaceholder")}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="province"
              label={t("checkout.provinceLabel")}
              rules={[
                {
                  required: true,
                  message: t("checkout.provinceRequired"),
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t("checkout.provincePlaceholder")}
                onChange={handleProvinceChange}
                loading={loadingProvinces}
                showSearch
                optionFilterProp="children"
              >
                {provinces.map((p) => (
                  <Select.Option key={p.code} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="ward"
              label={t("checkout.wardLabel")}
              rules={[
                {
                  required: true,
                  message: t("checkout.wardRequired"),
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t("checkout.wardPlaceholder")}
                loading={loadingWards}
                disabled={wards.length === 0}
                showSearch
                optionFilterProp="children"
              >
                {wards.map((w) => (
                  <Select.Option key={w.code} value={w.name}>
                    {w.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="addressDetail"
          label={t("checkout.addressDetailLabel")}
          rules={[
            {
              required: true,
              message: t("checkout.addressDetailRequired"),
            },
          ]}
        >
          <Input
            prefix={<HomeOutlined style={{ color: "#94a3b8" }} />}
            placeholder={t("checkout.addressDetailPlaceholder")}
            size="large"
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <Button
            size="large"
            onClick={handleCancel}
            style={{ borderRadius: 8, minWidth: 90 }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{ borderRadius: 8, minWidth: 120 }}
          >
            {t("common.confirm")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ShippingAddressModal;
