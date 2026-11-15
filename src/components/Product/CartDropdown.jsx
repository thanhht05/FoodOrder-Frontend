import { Button, Badge, Empty } from "antd";
import { ShoppingCartOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";

const CartDropdown = () => {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();

    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleRedirectBook = (product) => {
    const slug = convertSlug(product.name);
    navigate(`/product/${slug}?id=${product.id}`);
  };

  return (
    <div
      style={{
        width: 340,
        padding: 16,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 16px 40px -4px rgba(15, 23, 42, 0.14)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
          <ShoppingCartOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          {t("cart.stepCart")}
        </span>
        <Badge count={cart.length} color="#ff4d4f" />
      </div>

      {/* LIST ITEM */}
      <div
        style={{
          maxHeight: 280,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {cart.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("product.emptyCart")}
            style={{ margin: "20px 0" }}
          />
        ) : (
          cart.map((item) => (
            <div
              onClick={() => handleRedirectBook(item)}
              key={item.productId || item.id}
              style={{
                cursor: "pointer",
                display: "flex",
                gap: 12,
                padding: "8px",
                marginBottom: 6,
                borderRadius: 10,
                alignItems: "center",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fff7f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: 52,
                  height: 52,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#1e293b",
                    lineHeight: "18px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>

                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {item.price?.toLocaleString("vi-VN")}₫ × {item.quantity}
                </div>
              </div>

              <div
                style={{
                  color: "#ff4d4f",
                  fontWeight: 700,
                  fontSize: 13.5,
                  flexShrink: 0,
                }}
              >
                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <>
          <div
            style={{
              borderTop: "1px dashed #e2e8f0",
              paddingTop: 12,
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#64748b", fontSize: 13.5 }}>
              {t("cart.subtotal")}
            </span>
            <span style={{ color: "#ff4d4f", fontWeight: 800, fontSize: 16 }}>
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <Button
            type="primary"
            block
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{
              marginTop: 12,
              height: 42,
              borderRadius: 10,
              background: "linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%)",
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 6px 16px rgba(255, 77, 79, 0.25)",
            }}
            onClick={() => navigate("/cart")}
          >
            {t("product.viewCart")}
          </Button>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
