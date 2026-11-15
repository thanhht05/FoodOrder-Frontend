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
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./product.scss";
import ProductSkeleton from "./ProductSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAPI } from "../../redux/thunk/addToCartAPI";
import { useNavigate } from "react-router-dom";
import { getCartAPI } from "../../redux/thunk/getCartThunk";
import { useTranslation } from "../../i18n";

const { Title, Text, Paragraph } = Typography;

const ModalGallery = ({ images = [], productData }) => {
  const { t } = useTranslation();
  const galleryRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0);
  const dispatch = useDispatch();
  const maxQuantityProduct = productData?.quantity || 99;
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const navigate = useNavigate();
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (galleryRef.current) {
      galleryRef.current.slideToIndex(index);
    }
  };

  const handleAddProductToCart = async (quantity, product) => {
    if (isAuthenticated) {
      await dispatch(
        addToCartAPI({
          productId: product.id,
          quantity: quantity,
        })
      );
      dispatch(getCartAPI());
    } else {
      message.warning(t("product.pleaseLoginToAdd"));
      navigate("/login");
      return;
    }

    message.success(t("product.addedToCartSuccess"));
  };

  const variants = [
    t("product.sizeSmall"),
    t("product.sizeMedium"),
    t("product.sizeLarge"),
  ];

  const originalPrice = productData?.price
    ? Math.round((productData.price * 1.25) / 1000) * 1000
    : 0;

  return !productData ? (
    <div className="product-detail-page">
      <div className="product-detail-wrapper">
        <ProductSkeleton />
      </div>
    </div>
  ) : (
    <div className="product-detail-page">
      <div className="product-detail-wrapper">
        <div className="back-nav-bar">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            className="back-home-btn"
          >
            {t("auth.backToHome")}
          </Button>
        </div>

        <div className="premium-product-container">
          <Row className="gallery-wrapper">
            {/* LEFT: PRODUCT GALLERY */}
            <Col xs={24} md={11} className="image-section">
              <div className="main-display">
                <ImageGallery
                  ref={galleryRef}
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  startIndex={currentIndex}
                  showThumbnails={false}
                  showNav={false}
                  onSlide={(index) => setCurrentIndex(index)}
                />
              </div>

              {images.length > 1 && (
                <div className="thumbnail-strip">
                  <div className="strip-container">
                    {images.map((item, i) => (
                      <div
                        key={i}
                        className={`custom-thumb ${
                          currentIndex === i ? "active" : ""
                        }`}
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
              )}
            </Col>

            {/* RIGHT: PRODUCT DETAILS */}
            <Col xs={24} md={13} className="info-section">
              <div className="info-scroll-area">
                <div className="info-header">
                  <div className="meta-top-row">
                    <Tag className="brand-tag">
                      {productData?.productCate?.name || "PREMIUM"}
                    </Tag>
                    <Text type="secondary" className="sku-text">
                      SKU: #{productData?.id || "2026"}
                    </Text>
                  </div>

                  <Title level={2} className="product-title">
                    {productData?.name}
                  </Title>

                  <Space className="rating-wrap" size={12}>
                    <Rate
                      disabled
                      defaultValue={4.5}
                      allowHalf
                      className="custom-rate"
                    />
                    <Text type="secondary">
                      {t("product.reviewsCount", { count: 128 })}
                    </Text>
                  </Space>
                </div>

                <Divider className="custom-divider" />

                <div className="info-body">
                  <div className="price-box">
                    <Text className="amount">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productData?.price || 0)}
                    </Text>

                    {originalPrice > 0 && (
                      <Text delete className="old-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(originalPrice)}
                      </Text>
                    )}

                    <Tag color="#ff4d4f" className="discount-tag">
                      -20%
                    </Tag>
                  </div>

                  {/* Size Selection */}
                  <div className="variant-selection">
                    <Text strong className="field-label">
                      {t("product.selectSize")}
                    </Text>
                    <Space className="variant-list" wrap>
                      {variants.map((v, idx) => (
                        <Button
                          key={idx}
                          type={activeVariant === idx ? "primary" : "default"}
                          onClick={() => setActiveVariant(idx)}
                          className={`variant-btn ${
                            activeVariant === idx ? "active" : ""
                          }`}
                        >
                          {v}
                        </Button>
                      ))}
                    </Space>
                  </div>

                  {/* Quantity */}
                  <div className="quantity-row">
                    <Text strong className="field-label">
                      {t("product.quantity")}
                    </Text>
                    <InputNumber
                      min={1}
                      max={maxQuantityProduct}
                      value={currentQuantity}
                      onChange={(value) => setCurrentQuantity(value || 1)}
                      size="large"
                      className="qty-input"
                    />
                  </div>

                  <Paragraph
                    className="product-desc"
                    ellipsis={{
                      rows: 4,
                      expandable: true,
                      symbol: t("product.seeMore"),
                    }}
                  >
                    {productData?.description || t("product.noDescription")}
                  </Paragraph>

                  <div className="benefits-list">
                    <div className="benefit-item">
                      <ThunderboltOutlined className="benefit-icon" />
                      <span>{t("product.fastDelivery")}</span>
                    </div>
                    <div className="benefit-item">
                      <SafetyOutlined className="benefit-icon" />
                      <span>{t("product.qualityGuarantee")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-footer">
                <div className="btn-group">
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
                    {t("product.addToCart").toUpperCase()}
                  </Button>
                </div>
                <Text type="secondary" className="ship-note">
                  {t("product.freeShipNote")}
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ModalGallery;
