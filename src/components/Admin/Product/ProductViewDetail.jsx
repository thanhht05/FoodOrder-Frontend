import { Descriptions, Divider, Drawer, Space, Image, Upload } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ProductViewDetail = ({
  productDataDetail,
  openProductViewDetail,
  setOpenProductViewDetail,
}) => {
  const onClose = () => {
    setOpenProductViewDetail(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (productDataDetail) {
      let lstImg = [];

      if (productDataDetail.lstImg) {
        const resLtsImg = productDataDetail.lstImg;

        resLtsImg.forEach((i) => {
          const img = {
            uid: uuidv4(),
            name: i.name,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/upload/${i.name}`,
          };
          lstImg.push(img);
        });
      }

      setFileList(lstImg);
    }
  }, [productDataDetail]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  console.log(fileList);
  return (
    <>
      <Drawer
        title="Chi tiết sản phẩm"
        onClose={onClose}
        open={openProductViewDetail}
      >
        {/* Info */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Tên sản phẩm">
            {productDataDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">
            {productDataDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            {productDataDetail?.price}
          </Descriptions.Item>

          <Descriptions.Item label="Danh mục">
            {productDataDetail?.productCate.name}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {productDataDetail?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Cập nhật lúc">
            {dayjs(productDataDetail?.updatedAt).isValid()
              ? dayjs(productDataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
              : "Sản phẩm chưa được cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo lúc">
            {dayjs(productDataDetail?.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
        <Divider>Ảnh sản phẩm</Divider>

        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
        </Upload>
        {previewImage && (
          <Image
            on
            styles={{ root: { display: "none" } }}
            preview={{
              open: previewOpen,
              onOpenChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Drawer>
    </>
  );
};
export default ProductViewDetail;
