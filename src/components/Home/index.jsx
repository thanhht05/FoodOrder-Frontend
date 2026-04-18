import {
  Col,
  Row,
  Checkbox,
  Spin,
  Form,
  Divider,
  InputNumber,
  Button,
  Tabs,
  Card,
  Pagination,
  Rate,
  Typography,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { callFetchAllCategory, callFetchAllProcut } from "../../services/api";

const { Text, Title } = Typography;

const Home = () => {
  const { Meta } = Card;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 8;

  const [sortQuery, setSortQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await callFetchAllCategory();
      if (res && res.data) {
        setCategoryData(res.data.results);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let query = `page=${currentPage}&size=${pageSize}`;

    const fetchProduct = async () => {
      const res = await callFetchAllProcut(query);
      if (res && res.data) {
        setProductData(res.data.results);
        setTotal(res.data.meta.totalElements);
      }
    };
    fetchProduct();
  }, [currentPage, total, sortQuery]);

  const tabItems = [
    { key: "1", label: "Phổ biến" },
    { key: "2", label: "Hàng mới" },
    { key: "3", label: "Giá thấp đến cao" },
    { key: "4", label: "Giá cao đến thấp" },
  ];

  const onFinishFilter = (values) => {
    console.log("Filter values:", values);
    // Trigger your API call with filters here
  };

  return (
    <div className="home-container">
      <div className="container-layout">
        <Row gutter={[24, 24]}>
          {/* Sidebar Filter */}
          <Col xs={0} lg={5}>
            <div className="filter-sidebar">
              <div className="filter-header">
                <span>
                  <FilterOutlined className="icon-green" />
                  <span className="filter-title">BỘ LỌC TÌM KIẾM</span>
                </span>
                <ReloadOutlined
                  className="reset-btn"
                  title="Làm mới"
                  onClick={() => form.resetFields()}
                />
              </div>
              <Divider />

              <Form form={form} onFinish={onFinishFilter} layout="vertical">
                <Form.Item name="category" label="Danh mục sản phẩm">
                  <Checkbox.Group className="custom-checkbox-group">
                    <Row style={{ marginBottom: 8 }}>
                      {categoryData.map((i) => (
                        <Col span={24} style={{ padding: "6px" }}>
                          <Checkbox value={i.id}>{i.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Divider />

                <Form.Item label="Khoảng giá">
                  <div className="price-range-inputs">
                    <Form.Item name={["price", "from"]} noStyle>
                      <InputNumber
                        placeholder="Từ đ"
                        formatter={(val) =>
                          `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                    <span className="separator">-</span>
                    <Form.Item name={["price", "to"]} noStyle>
                      <InputNumber
                        placeholder="Đến đ"
                        formatter={(val) =>
                          `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="apply-btn"
                  >
                    Áp dụng
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          {/* Product Listing Area */}
          <Col xs={24} lg={19}>
            <div className="product-content-area">
              <div className="sorting-tabs">
                <Tabs
                  defaultActiveKey="1"
                  items={tabItems}
                  onChange={(key) => console.log(key)}
                />
              </div>

              <Spin spinning={isLoading}>
                <Row gutter={[16, 16]}>
                  {productData.map((p) => (
                    <Col key={p.id} xs={12} sm={8} md={8} lg={6} key={p.id}>
                      <Card
                        hoverable
                        className="product-card"
                        cover={
                          <div className="image-wrapper">
                            <img
                              alt={p.name}
                              src={`${import.meta.env.VITE_BACKEND_URL}/upload/${p.lstImg?.[0]?.name}`}
                            />
                          </div>
                        }
                      >
                        <div className="product-info">
                          <Text
                            ellipsis={{ tooltip: p.name }}
                            className="product-name"
                          >
                            {p.name}
                          </Text>
                          <div className="product-price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(p.price)}
                          </div>
                          <div className="product-footer">
                            <Text type="secondary" size="small">
                              Đã bán 1.2k
                            </Text>
                            <span>
                              <Rate disabled defaultValue={5} />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>

              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
