import { DatePicker, Form, Input, InputNumber, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateVoucher } from "../../../services/api";
import dayjs from "dayjs";

const VoucherModalUpdate = (props) => {
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
      message.success("Cập nhật voucher thành công");
      setOpenModalUpdate(false);
      setDataUpdate(null);
      await fetchVoucher();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <Modal
      title="Cập nhật voucher"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
      }}
      okText="Cập nhật"
      cancelText="Hủy"
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
          label="Mã Voucher"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phần trăm giảm (%)"
          name="percentDiscount"
          rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm!" }]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Giảm tối đa (VNĐ)"
          name="maxDiscount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền giảm tối đa!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Giới hạn sử dụng"
          name="usageLimit"
          rules={[{ required: true, message: "Vui lòng nhập giới hạn sử dụng!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Ngày hết hạn"
          name="expiration"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherModalUpdate;
