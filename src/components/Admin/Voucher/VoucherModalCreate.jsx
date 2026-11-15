import { Button, DatePicker, Form, Input, InputNumber, message, Modal, notification } from "antd";
import { useState } from "react";
import { callCreateVoucher } from "../../../services/api";
import dayjs from "dayjs";
import { useTranslation } from "../../../i18n";

const VoucherModalCreate = (props) => {
  const { t } = useTranslation();
  const { openModalCreate, setOpenModalCreate, fetchVoucher } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { code, percentDiscount, maxDiscount, usageLimit, expiration } = values;
    const formattedExpiration = expiration ? dayjs(expiration).format("YYYY-MM-DD") : null;
    
    setIsSubmit(true);
    const res = await callCreateVoucher(code, formattedExpiration, percentDiscount, maxDiscount, usageLimit);
    setIsSubmit(false);
    
    if (res && res.data) {
      message.success(t("admin.voucher.createSuccess"));
      form.resetFields();
      setOpenModalCreate(false);
      await fetchVoucher();
    } else {
      notification.error({
        message: t("common.errorOccurred"),
        description: res.message,
      });
    }
  };

  return (
    <Modal
      title={t("admin.voucher.createModalTitle")}
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText={t("common.create")}
      cancelText={t("common.cancel")}
      confirmLoading={isSubmit}
    >
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label={t("admin.voucher.codeLabel")}
          name="code"
          rules={[{ required: true, message: t("admin.voucher.codeRequired") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("admin.voucher.percentLabel")}
          name="percentDiscount"
          rules={[{ required: true, message: t("admin.voucher.percentRequired") }]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={t("admin.voucher.maxDiscountLabel")}
          name="maxDiscount"
          rules={[{ required: true, message: t("admin.voucher.maxDiscountRequired") }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={t("admin.voucher.usageLimitLabel")}
          name="usageLimit"
          rules={[{ required: true, message: t("admin.voucher.usageLimitRequired") }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={t("admin.voucher.expirationLabel")}
          name="expiration"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherModalCreate;
