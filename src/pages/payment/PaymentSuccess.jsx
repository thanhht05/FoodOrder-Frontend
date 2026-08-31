import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px' }}>
      <Result
        status="success"
        title="Thanh toán thành công"
        subTitle="Đơn hàng của bạn đang được xử lý."
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

export default PaymentSuccess;
