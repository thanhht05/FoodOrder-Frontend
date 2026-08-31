# PayOS Payment Flow - Frontend Guide

## 1. Mục tiêu

Khi user bấm **Đặt hàng / Thanh toán**:

```text
Checkout Page
      ↓
Gọi API tạo Payment Link
      ↓
Backend tạo Order + Payment Link PayOS
      ↓
Backend trả checkoutUrl
      ↓
Frontend redirect user sang PayOS

2. API tạo Payment Link

POST /order/create-payment-link
Request Body: {
  "orderId": 123
}

RES {
    "statusCode": 200,
    "error": null,
    "message": "Call api success",
    "data": {
        "bin": "970422",
        "accountNumber": "VQRQALPUL5940",
        "accountName": "NGUYEN HUU THANH",
        "amount": 20000,
        "description": "Order 1",
        "orderCode": 1788085282,
        "currency": "VND",
        "paymentLinkId": "c4b1ed52850d49ea82c282dcf9d35673",
        "status": "PENDING",
        "expiredAt": null,
        "checkoutUrl": "https://pay.payos.vn/web/c4b1ed52850d49ea82c282dcf9d35673",
        "qrCode": "00020101021238570010A000000727012700069704220113VQRQALPUL59400208QRIBFTTA53037045405200005802VN62110807Order 163045986"
    }
}

5. Flow Frontend

CheckoutPage
     │
     │ User click "Đặt hàng"
     ▼
handlePlaceOrder()
     │
     ▼
POST /order/create-payment-link
     │
     ▼
Backend
     │
     ▼
PayOS
     │
     ▼
checkoutUrl
     │
     ▼
window.location.href
     │
     ▼
PayOS Checkout

6. Return URL

Khi tạo Payment Link, Frontend gửi:

{
  "returnUrl": "http://localhost:5173/payment/success"
}

Nếu thanh toán xong, PayOS sẽ redirect user về:

/payment/success

Frontend tạo page:

src/pages/payment/PaymentSuccess.jsx

Ví dụ:

const PaymentSuccess = () => {
  return (
    <div>
      <h1>Thanh toán thành công</h1>
      <p>Đơn hàng của bạn đang được xử lý.</p>
    </div>
  );
};

export default PaymentSuccess;
7. Cancel URL

Khi user hủy/thao tác thanh toán không tiếp tục:

/payment/cancel

Frontend tạo:

src/pages/payment/PaymentCancel.jsx

Ví dụ:

const PaymentCancel = () => {
  return (
    <div>
      <h1>Thanh toán chưa hoàn tất</h1>

      <p>
        Đơn hàng của bạn vẫn đang chờ thanh toán.
      </p>

      <button>
        Thanh toán lại
      </button>
    </div>
  );
};

export default PaymentCancel;