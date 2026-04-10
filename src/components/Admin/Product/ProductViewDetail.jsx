import { Descriptions, Divider, Drawer, Space } from "antd";
import dayjs from "dayjs";

const ProductViewDetail = ({
  productDataDetail,
  openProductViewDetail,
  setOpenProductViewDetail,
}) => {
  const onClose = () => {
    setOpenProductViewDetail(false);
  };
  return (
    <>
      <Drawer
        title="User Detail"
        onClose={onClose}
        open={openProductViewDetail}
      >
        {/* Info */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Name">
            {productDataDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Quanity">
            {productDataDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {productDataDetail?.price}
          </Descriptions.Item>

          <Descriptions.Item label="Category">
            {productDataDetail?.productCate.name}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {productDataDetail?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Updated at">
            {dayjs(productDataDetail?.updatedAt).isValid()
              ? dayjs(productDataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
              : "Product chưa được cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {dayjs(productDataDetail?.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
        <Divider>Ảnh sản phẩm</Divider>
      </Drawer>
    </>
  );
};
export default ProductViewDetail;
