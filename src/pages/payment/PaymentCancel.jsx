import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

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
