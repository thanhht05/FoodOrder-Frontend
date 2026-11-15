import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Select,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  callCreateProduct,
  callFetchAllCategory,
  callUploadProductImg,
} from "../../../services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "../../../i18n";

const ProductModalCreate = ({
  openModalCreateProduct,
  setOpenModalCreateProduct,
  fetchProduct,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [dataImg, setDataImg] = useState([]);

  const [previewTitle, setPreviewTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      );
    });
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(t("admin.product.imageFormatError"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("admin.product.imageSizeError"));
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModalCreateProduct(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchAllCategory();
      if (res && res.data) {
        const lst = res.data.results;
        const cate = lst.map((item) => {
          return { lable: item.name, value: item.name };
        });

        setListCategory(cate);
      }
    };
    fetchCategory();
  }, []);
  const handleUploadFile = async ({ file, onSuccess, onError }) => {
    const res = await callUploadProductImg(file);
    if (res && res.data) {
      setDataImg((img) => [
        ...img,
        {
          name: res.data.imgUrl,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError(t("admin.product.uploadFileError"));
    }
  };
  const onFinish = async (values) => {
    if (dataImg.length === 0) {
      notification.error({
        message: t("common.validationError"),
        description: t("admin.product.uploadSliderRequired"),
      });
      return;
    }
    setIsSubmit(true);
    const { name, price, quantity, categoryName, description } = values;

    const fileNamImg = dataImg.map((item) => item.name);

    const res = await callCreateProduct(
      name,
      price,
      quantity,
      fileNamImg,
      categoryName,
      description,
    );
    if (res && res.data) {
      form.resetFields();
      setDataImg([]);
      setOpenModalCreateProduct(false);
      await fetchProduct();
    } else {
      notification.error({
        message: t("common.errorOccurred"),
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title={t("admin.product.createModalTitle")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalCreateProduct}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        okText={t("common.create")}
        cancelText={t("common.cancel")}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item
            name="name"
            label={t("admin.product.searchNameLabel")}
            rules={[{ required: true, message: t("admin.product.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label={t("admin.product.colPrice")}
            rules={[{ required: true, message: t("admin.product.priceRequired") }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              addonAfter="VND"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label={t("admin.product.colQuantity")}
            rules={[{ required: true, message: t("admin.product.quantityRequired") }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item
            name="categoryName"
            label={t("admin.product.colCategory")}
            rules={[{ required: true, message: t("admin.product.categoryRequired") }]}
          >
            <Select
              showSearch={{
                optionFilterProp: ["label", "otherField"],
              }}
              placeholder={t("admin.product.searchCategoryPlaceholder")}
              options={listCategory}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("admin.product.colDescription")}
            rules={[{ required: true, message: t("admin.product.descriptionRequired") }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item name="file" label={t("admin.product.productImagesSection")}>
            <Upload
              multiple
              name="file"
              customRequest={handleUploadFile}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onRemove={(file) => {
                setDataImg((prev) =>
                  prev.filter((item) => item.uid !== file.uid),
                );
              }}
              listType="picture-card"
            >
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>{t("admin.product.uploadBtn")}</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
export default ProductModalCreate;
