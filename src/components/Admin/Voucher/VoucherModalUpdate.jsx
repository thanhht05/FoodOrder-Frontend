import { DatePicker, Form, Input, InputNumber, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateVoucher } from "../../../services/api";
import dayjs from "dayjs";
import { useTranslation } from "../../../i18n";

const VoucherModalUpdate = (props) => {
  const { t } = useTranslation();
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, fetchVoucher } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        code: dataUpdate.code,
        percentDiscount: dataUpdate.percentDiscount,
        maxDiscount: dataUpdate.maxDiscount,
        usageLimit: dataUpdate.usageLimit,
        expiration: dataUpdate.expiration ? dayjs(dataUpdate.expiration) : null,
      });
    }
  }, [dataUpdate, form]);

  const onFinish = async (values) => {
    const { code, percentDiscount, maxDiscount, usageLimit, expiration } = values;
    const formattedExpiration = expiration ? dayjs(expiration).format("YYYY-MM-DD") : null;
    
    setIsSubmit(true);
    const res = await callUpdateVoucher(dataUpdate.id, code, formattedExpiration, percentDiscount, maxDiscount, usageLimit);
    setIsSubmit(false);
    
    if (res && res.data) {
      message.success(t("admin.voucher.updateSuccess"));
      setOpenModalUpdate(false);
      setDataUpdate(null);
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
      title={t("admin.voucher.updateModalTitle")}
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
      }}
      okText={t("common.update")}
      cancelText={t("common.cancel")}
      confirmLoading={isSubmit}
    >
      <Form
        name="basic_update"
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

export default VoucherModalUpdate;
