import { Row, Col, Typography, Tag, Button, Divider } from "antd";
import ModalGallery from "./ModalGallery";

const { Title, Text } = Typography;

const ViewDetail = ({ productData }) => {
  // if (!productData) return null;

  const images = productData?.items ?? [];

  return <ModalGallery images={images} productData={productData} />;
};

export default ViewDetail;
