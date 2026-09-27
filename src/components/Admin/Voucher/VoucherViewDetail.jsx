import { Drawer, Descriptions } from "antd";
import dayjs from "dayjs";

const VoucherViewDetail = ({
  openViewDetail,
  setOpenViewDetail,
  dataDetail,
  setDataDetail,
}) => {
  const onClose = () => {
    setOpenViewDetail(false);
    setDataDetail(null);
  };
  return (
    <Drawer title="Chi tiết voucher" onClose={onClose} open={openViewDetail} width={500}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="ID">{dataDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Mã Voucher">
          {dataDetail?.code}
        </Descriptions.Item>
        <Descriptions.Item label="Phần trăm giảm">
          {dataDetail?.percentDiscount}%
        </Descriptions.Item>
        <Descriptions.Item label="Giảm tối đa (VNĐ)">
          {dataDetail?.maxDiscount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.maxDiscount) : '0 ₫'}
        </Descriptions.Item>
        <Descriptions.Item label="Lượt sử dụng còn lại">
          {dataDetail?.usageLimit}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày hết hạn">
          {dataDetail?.expiration && dayjs(dataDetail?.expiration).isValid()
            ? dayjs(dataDetail?.expiration).format("DD/MM/YYYY")
            : "Không giới hạn"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
           {dataDetail?.status || 'ACTIVE'}
        </Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          {dataDetail?.createdBy || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tạo lúc">
          {dataDetail?.createdAt && dayjs(dataDetail?.createdAt).isValid()
            ? dayjs(dataDetail?.createdAt).format("DD/MM/YYYY HH:mm")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Người cập nhật">
          {dataDetail?.updatedBy || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lúc">
          {dataDetail?.updatedAt && dayjs(dataDetail?.updatedAt).isValid()
            ? dayjs(dataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default VoucherViewDetail;
