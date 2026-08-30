1. Trang "Đơn hàng của tôi"
Có thiết kế
┌─────────────────────────────────────────────────────────┐
│                  ĐƠN HÀNG CỦA TÔI                       │
│                                                         │
│  Tất cả   Chờ thanh toán   Đang xử lý   Đang giao   Đã giao │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  #ORD20260830001                         CHỜ THANH TOÁN │
│  30/08/2026 10:30                                     │
│                                                         │
│  🍔 Burger x2                                           │
│  🍟 French Fries x1                                    │
│                                                         │
│  Tổng cộng: 250.000đ                                   │
│                                                         │
│             [ Thanh toán ngay ] [ Xem chi tiết ]       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  #ORD20260829015                         ĐANG GIAO      │
│                                                         │
│  🍕 Pizza x1                                            │
│                                                         │
│  Tổng cộng: 180.000đ                                   │
│                                                         │
│                    [ Theo dõi đơn hàng ]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
2. Quan trọng nhất: "Chờ thanh toán"
Đơn chưa thanh toán nên đưa lên đầu:
┌───────────────────────────────────────────┐
│ ⚠ Đơn hàng chưa thanh toán                │
│                                           │
│ #ORD20260830001                           │
│ 2 món                                     │
│ Tổng: 250.000đ                            │
│                                           │
│ Thanh toán trước: 10 phút                 │
│                                           │
│ [ 💳 Thanh toán ngay ]                    │
│ [ Xem chi tiết ]                          │
└───────────────────────────────────────────┘
Khi user bấm:

Thanh toán ngay

→ đưa thẳng về trang thanh toán của chính Order đó.
Order
  ↓
Payment
  ↓
QR / Online Payment

Không nên tạo Order mới.

3. Theo dõi đơn hàng
Với đơn đã thanh toán:
┌─────────────────────────────────────────────┐
│ Đơn hàng #ORD20260829015                    │
│                                             │
│ ✓ Đã đặt hàng                               │
│ │ 10:20                                     │
│ │                                           │
│ ✓ Đã xác nhận                               │
│ │ 10:22                                     │
│ │                                           │
│ ● Đang chuẩn bị                             │
│ │                                           │
│ ○ Đang giao                                 │
│ │                                           │
│ ○ Đã giao                                   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Burger x2                         120.000đ  │
│ Fries x1                          60.000đ   │
│                                             │
│ Tổng cộng                        180.000đ   │
└─────────────────────────────────────────────┘

 WebSocket, đây là chỗ rất phù hợp để realtime cập nhật:
 PENDING_PAYMENT
       ↓
PAID
       ↓
CONFIRMED
       ↓
PREPARING
       ↓
DELIVERING
       ↓
COMPLETED: Frontend không cần refresh trang.


6. UX mình khuyên dùng

┌────────────────────────────────────────────┐
│ #ORD001                    🟠 Chờ thanh toán│
│ 30/08/2026                                 │
├────────────────────────────────────────────┤
│ 🍔 Burger                  x2     120.000đ │
│ 🍟 Fries                   x1      60.000đ │
├────────────────────────────────────────────┤
│ Tổng cộng                         180.000đ │
├────────────────────────────────────────────┤
│ [Thanh toán ngay]       [Xem chi tiết]     │
└────────────────────────────────────────────┘
Còn đơn đang giao:
┌────────────────────────────────────────────┐
│ #ORD002                    🔵 Đang giao    │
│                                            │
│ 🍕 Pizza x2                                │
│                                            │
│ Tổng: 300.000đ                             │
│                                            │
│ [Theo dõi đơn hàng]                        │
└────────────────────────────────────────────┘