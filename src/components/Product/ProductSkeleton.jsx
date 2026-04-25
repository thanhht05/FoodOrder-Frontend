import { DotChartOutlined } from "@ant-design/icons";
import { Col, Row, Skeleton, Space } from "antd";
import { act } from "react";

const ProductSkeleton = () => {
  const active = true;
  return (
    <div style={{ paddingTop: "10px" }}>
      <Row>
        <Col style={{ textAlign: "center" }} xs={0} md={12} lg={10}>
          <Skeleton.Node active={active} style={{ width: 560, height: 400 }} />
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              paddingTop: "10px",
            }}
          >
            <Skeleton.Node
              active={active}
              style={{ width: 200, height: 100 }}
            />
            <Skeleton.Node
              active={active}
              style={{ width: 200, height: 100 }}
            />
          </div>
        </Col>
        <Col xs={24} md={12} lg={14}>
          <Skeleton active={active} />
          <Skeleton active={active} />
          <Skeleton active={active} />
        </Col>
      </Row>
    </div>
  );
};
export default ProductSkeleton;
