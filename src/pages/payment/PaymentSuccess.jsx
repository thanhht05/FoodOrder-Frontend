import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ padding: '50px' }}>
      <Result
        status="success"
        title={t("payment.successTitle")}
        subTitle={t("payment.successSubTitle")}
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/order-history')}>
            {t("payment.viewOrderHistoryBtn")}
          </Button>,
          <Button key="buy" onClick={() => navigate('/')}>{t("payment.continueShoppingBtn")}</Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;
