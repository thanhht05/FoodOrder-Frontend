import { Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartDropdown = () => {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("Cart", cart);
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
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };
  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (product) => {
    const slug = convertSlug(product.name);
    navigate(`/product/${slug}?id=${product.id}`);
  };
  return (
    <div
      style={{
        width: 320,
        padding: 12,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <h4 style={{ marginBottom: 10 }}>Giỏ hàng</h4>

      {/* LIST ITEM */}
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {cart.length === 0 ? (
          <p style={{ textAlign: "center" }}>Giỏ hàng trống</p>
        ) : (
          cart.map((item) => (
            <div
              onClick={() => handleRedirectBook(item)}
              key={item.productId}
              style={{
                cursor: "pointer",
                display: "flex",
                gap: 10,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              {/* IMAGE */}
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`}
                alt={item.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />

              {/* INFO */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "16px",
                  }}
                >
                  {item.name}
                </div>

                <div style={{ fontSize: 12, color: "#888" }}>
                  x{item.quantity}
                </div>
              </div>

              {/* PRICE */}
              <div
                style={{
                  color: "#ff4d4f",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {(item.price * item.quantity).toLocaleString()}₫
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
              borderTop: "1px solid #f0f0f0",
              paddingTop: 10,
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
            }}
          >
            <span>Tổng:</span>
            <span style={{ color: "#ff4d4f" }}>{total.toLocaleString()}₫</span>
          </div>

          <Button
            // type="primary"

            block
            style={{
              marginTop: 10,
              background: "#ff4d4f",
              color: "#fff",
              fontSize: "18px",
            }}
            onClick={() => navigate("/cart")}
          >
            Xem giỏ hàng
          </Button>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
