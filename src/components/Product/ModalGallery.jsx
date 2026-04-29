import React, { useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import {
  Col,
  Row,
  Typography,
  Tag,
  Button,
  Divider,
  Space,
  Rate,
  InputNumber,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import "./product.scss";
import ProductSkeleton from "./ProductSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cart/CartSlice";
import { addToCartAPI } from "../../redux/thunk/addToCartAPI";
const { Title, Text, Paragraph } = Typography;

const ModalGallery = ({ images = [], productData }) => {
  const galleryRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0); // Giả lập chọn màu/size
  const dispatch = useDispatch();
  const maxQuantityProduct = productData?.quantity;
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const [currentQuantity, setCurrentQuantity] = useState(1);
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (galleryRef.current) {
      galleryRef.current.slideToIndex(index);
    }
  };

  const variants = ["Nhỏ", "Vừa", "Lớn"]; // Mock data

  const handleAddProductToCart = (quantity, product) => {
    if (isAuthenticated) {
      dispatch(
        addToCartAPI({
          productId: product.id,
          quantity: currentQuantity,
        }),
      );
    } else {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          img: product.lstImg?.[0]?.name,
          quantity: currentQuantity,
        }),
      );
    }

    message.success("Add product successfully");
  };
  return !productData ? (
    <ProductSkeleton />
  ) : (
    <div className="premium-product-container">
      <Row className="gallery-wrapper">
        {/* BÊN TRÁI: HIỂN THỊ HÌNH ẢNH */}
        <Col xs={24} md={10} className="image-section">
          <div className="main-display">
            <ImageGallery
              ref={galleryRef}
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              startIndex={currentIndex}
              showThumbnails={false}
              showNav={false} // Ẩn mũi tên để dùng thumbnail nhìn sang hơn
              onSlide={(index) => setCurrentIndex(index)}
            />
          </div>

          <div className="thumbnail-strip">
            <div className="strip-container">
              {images.map((item, i) => (
                <div
                  key={i}
                  className={`custom-thumb ${currentIndex === i ? "active" : ""}`}
                  onClick={() => handleThumbnailClick(i)}
                >
                  <img
                    src={item.thumbnail || item.original}
                    alt={`thumb-${i}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* BÊN PHẢI: THÔNG TIN SẢN PHẨM */}
        <Col xs={24} md={14} className="info-section">
          <div className="info-scroll-area">
            <div className="info-header">
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Space justify="space-between" style={{ display: "flex" }}>
                  <Tag color="#1890ff" className="brand-tag">
                    PREMIUM
                  </Tag>
                  <Text type="secondary" className="sku-text">
                    SKU: {productData?.sku || "2026-AFK"}
                  </Text>
                </Space>
                <Title level={2} className="product-title">
                  {productData?.name || "Tai nghe Bluetooth Chống Ồn Chủ Động"}
                </Title>
                <Space className="rating-wrap">
                  <Rate
                    disabled
                    defaultValue={4.5}
                    allowHalf
                    className="custom-rate"
                  />
                  <Text type="secondary">(128 đánh giá)</Text>
                </Space>
              </Space>
            </div>

            <Divider className="custom-divider" />

            <div className="info-body">
              <div className="price-box">
                <Text className="currency">₫</Text>
                <Text className="amount">
                  {" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(productData?.price)}
                </Text>

                <Text delete className="old-price">
                  900.000
                </Text>
              </div>

              <Tag color="#ff4d4f" className="discount-tag">
                -20%
              </Tag>
              <div style={{ marginTop: "20px" }}>
                Số lượng: &nbsp;
                <InputNumber
                  min={1}
                  max={maxQuantityProduct}
                  defaultValue={1}
                  onChange={(value) => setCurrentQuantity(value)}
                />
              </div>
              {/* Phân loại giả lập */}
              <div className="variant-selection">
                <Text strong>Lựa chọn size : &nbsp;</Text>
                <Space className="variant-list" style={{ marginTop: 8 }}>
                  {variants.map((v, idx) => (
                    <Button
                      key={idx}
                      type={activeVariant === idx ? "primary" : "default"}
                      onClick={() => setActiveVariant(idx)}
                      className={`variant-btn ${activeVariant === idx ? "active" : ""}`}
                    >
                      {v}
                    </Button>
                  ))}
                </Space>
              </div>

              <Paragraph
                className="product-desc"
                ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
              >
                {productData?.description ||
                  "Trải nghiệm âm thanh tuyệt đỉnh với công nghệ chống ồn chủ động (ANC). Thiết kế công thái học vừa vặn hoàn hảo, mang lại sự thoải mái trong suốt ngày dài sử dụng. Thời lượng pin lên đến 30 giờ liên tục."}
              </Paragraph>

              <div className="benefits-list">
                <Space size="large">
                  <span className="benefit-item">
                    <ThunderboltOutlined className="benefit-icon" /> Giao siêu
                    tốc 2H
                  </span>
                  <span className="benefit-item">
                    <SafetyOutlined className="benefit-icon" /> Bảo hành 12
                    tháng
                  </span>
                </Space>
              </div>
            </div>
          </div>

          <div className="info-footer">
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                onClick={() =>
                  handleAddProductToCart(currentQuantity, productData)
                }
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined style={{ fontSize: "20px" }} />}
                className="btn-add-cart"
              >
                THÊM VÀO GIỎ HÀNG
              </Button>
              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined style={{ fontSize: "20px" }} />}
                className="btn-add-cart"
              >
                MUA NGAY
              </Button>
            </div>
            <Text type="secondary" className="ship-note">
              * Miễn phí vận chuyển cho đơn hàng từ 500k
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ModalGallery;
