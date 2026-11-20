import React, { useState } from "react";
import { Tag, Button, Card } from "antd";
import {
  EnvironmentOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import ShippingAddressModal from "./ShippingAddressModal";
import "./ShippingAddress.scss";
import { useTranslation } from "../../i18n";

const LOCAL_STORAGE_KEY = "food_order_shipping_address";

const ShippingAddressCard = ({ address, onAddressChange }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaveAddress = (newAddress) => {
    onAddressChange(newAddress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAddress));
    } catch (e) {
      console.error("Lỗi lưu địa chỉ vào localStorage:", e);
    }
    setModalOpen(false);
  };

  const hasAddress = Boolean(
    address?.recipientName && address?.phone && address?.province && address?.addressDetail
  );

  return (
    <>
      <Card
        className={`checkout-card shipping-address-card ${hasAddress ? "has-address" : "empty"}`}
        bordered={false}
      >
        {hasAddress ? (
          <>
            <div className="address-header">
              <div className="header-left">
                <div className="location-icon-wrapper">
                  <EnvironmentOutlined />
                </div>
                <span className="card-title">
                  {t("checkout.deliveryAddressTitle")}
                </span>
                <Tag color="orange" style={{ borderRadius: 4, fontWeight: 500 }}>
                  {t("checkout.deliveryTag")}
                </Tag>
              </div>

              <Button
                type="link"
                className="btn-edit-address"
                icon={<EditOutlined />}
                onClick={() => setModalOpen(true)}
              >
                {t("common.edit")}
              </Button>
            </div>

            <div className="address-body">
              <div className="recipient-info">
                <span className="recipient-name">{address.recipientName}</span>
                <span className="divider">|</span>
                <span className="recipient-phone">{address.phone}</span>
              </div>
              <div className="address-text">
                {address.addressDetail}
                {address.ward ? `, ${address.ward}` : ""}
                {address.province ? `, ${address.province}` : ""}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-address-state">
            <InboxOutlined className="empty-icon" />
            <div className="empty-title">
              {t("checkout.noAddressTitle")}
            </div>
            <div className="empty-desc">
              {t("checkout.noAddressDesc")}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="btn-add-address"
              onClick={() => setModalOpen(true)}
            >
              {t("checkout.addShippingAddress")}
            </Button>
          </div>
        )}
      </Card>

      <ShippingAddressModal
        open={modalOpen}
        initialAddress={address}
        onCancel={() => setModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </>
  );
};

export default ShippingAddressCard;
