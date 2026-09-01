import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "../../utils/axiosCumtome";
const PaymentCancel = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const orderCode = params.get("orderCode");

  useEffect(() => {
    cancelPayment();
  }, []);

  const URLCancel = `/api/v1/payment-requests/${orderCode}/cancel`

  const cancelPayment = async () => {
    await axios.post(URLCancel);
  };

  return (
    <div style={{ padding: '50px' }}>
      <Result
        status="warning"
        title="Thanh toán chưa hoàn tất"
        subTitle="Đơn hàng của bạn vẫn đang chờ thanh toán."
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/order-history')}>
            Xem lịch sử đơn hàng
          </Button>,
          <Button key="buy" onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>,
        ]}
      />
    </div>
  );
};

export default PaymentCancel;
