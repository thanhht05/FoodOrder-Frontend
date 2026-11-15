import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "../../utils/axiosCumtome";
import { useTranslation } from '../../i18n';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        title={t("payment.cancelTitle")}
        subTitle={t("payment.cancelSubTitle")}
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

export default PaymentCancel;
