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
import { useEffect, useState } from "react";
import {
  callFetchAllCategory,
  calUpdateProduct,
  callUploadProductImg,
} from "../../../services/api";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const ProductModalUpdate = ({
  openModalUpdateProduct,
  setOpenModalUpdateProduct,
  setProductDataUpdate,
  productDataUpdate,
  fetchProduct,
}) => {
  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [initForm, setInitForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [dataImg, setDataImg] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchAllCategory();
      if (res && res.data) {
        const lst = res.data.results;
        const cate = lst.map((item) => {
          return { label: item.name, value: item.name };
        });

        setListCategory(cate);
      }
    };
    fetchCategory();
  }, []);

  //   init data form
  useEffect(() => {
    if (productDataUpdate?.id) {
      const imgs = productDataUpdate?.lstImg.map((item) => {
        return {
          uid: uuidv4(),
          name: item.name,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/upload/${item.name}`,
        };
      });

      const initData = {
        id: productDataUpdate?.id,
        name: productDataUpdate?.name,
        price: productDataUpdate?.price,
        updatedAt: productDataUpdate?.updatedAt,
        description: productDataUpdate?.description,
        quantity: productDataUpdate?.quantity,
        lstImg: { fileList: imgs },
        categoryName: productDataUpdate?.productCate?.name,
      };
      setInitForm(initData);

      setDataImg(imgs);
      form.setFieldsValue(initData);
    }
    return () => {
      form.resetFields();
    };
  }, [productDataUpdate]);
  const handleCancel = () => {
    setOpenModalUpdateProduct(false);
    setProductDataUpdate(null);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
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
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể tải lên tệp JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      );
    });
  };

  const handleUploadFile = async ({ file, onSuccess, onError }) => {
    const res = await callUploadProductImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataImg((dataImg) => [
        ...dataImg,
        {
          name: res.data.fileName,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };
  const onFinish = async (values) => {
    const { id, name, price, quantity, categoryName, description } = values;
    const fileNameImg = dataImg.map((item) => item.name);

    const res = await calUpdateProduct(
      id,
      name,
      price,
      quantity,
      fileNameImg,
      categoryName,
      description,
    );
    setIsSubmit(true);

    if (res && res.data) {
      message.success("Cập nhật sản phẩm thành công");
      form.resetFields();
      setDataImg([]);
      setInitForm(null);
      setOpenModalUpdateProduct(false);
      await fetchProduct();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Cập nhật sản phẩm"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpdateProduct}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item name="id" label="Id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
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
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
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
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Chọn danh mục"
              options={listCategory}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item name="file" label="Tải ảnh lên">
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
              defaultFileList={initForm?.lstImg?.fileList ?? []}
            >
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Tải lên</div>
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
export default ProductModalUpdate;
