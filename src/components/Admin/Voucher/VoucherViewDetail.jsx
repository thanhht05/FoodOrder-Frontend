import { Drawer, Descriptions } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "../../../i18n";

const VoucherViewDetail = ({
  openViewDetail,
  setOpenViewDetail,
  dataDetail,
  setDataDetail,
}) => {
  const { t } = useTranslation();
  const onClose = () => {
    setOpenViewDetail(false);
    setDataDetail(null);
  };
  return (
    <Drawer title={t("admin.voucher.detailDrawerTitle")} onClose={onClose} open={openViewDetail} width={500}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label={t("admin.voucher.colId")}>{dataDetail?.id}</Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.codeLabel")}>
          {dataDetail?.code}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.colPercentDiscount")}>
          {dataDetail?.percentDiscount}%
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.maxDiscountLabel")}>
          {dataDetail?.maxDiscount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.maxDiscount) : '0 ₫'}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.remainingUsesLabel")}>
          {dataDetail?.usageLimit}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.expirationLabel")}>
          {dataDetail?.expiration && dayjs(dataDetail?.expiration).isValid()
            ? dayjs(dataDetail?.expiration).format("DD/MM/YYYY")
            : t("admin.voucher.noExpiration")}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.colStatus")}>
           {dataDetail?.status || 'ACTIVE'}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.createdByLabel")}>
          {dataDetail?.createdBy || t("common.notAvailable")}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.createdAtLabel")}>
          {dataDetail?.createdAt && dayjs(dataDetail?.createdAt).isValid()
            ? dayjs(dataDetail?.createdAt).format("DD/MM/YYYY HH:mm")
            : t("common.notAvailable")}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.updatedByLabel")}>
          {dataDetail?.updatedBy || t("common.notAvailable")}
        </Descriptions.Item>
        <Descriptions.Item label={t("admin.voucher.updatedAtLabel")}>
          {dataDetail?.updatedAt && dayjs(dataDetail?.updatedAt).isValid()
            ? dayjs(dataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
            : t("common.notAvailable")}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default VoucherViewDetail;
