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
import { useLocation, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { Meta } = Card;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 8;

  const [sortQuery, setSortQuery] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await callFetchAllCategory();
      if (res && res.data) {
        setCategoryData(res.data.results);
      }
    };
    fetchCategories();
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const searchKeyword = params.get("search");

  // const search = params.get("search");
  useEffect(() => {
    let query = `page=${currentPage}&size=${pageSize}`;
    if (sortQuery) {
      query += `&sort=${sortQuery}`;
    }
    if (filter) {
      query += `&${filter}`;
    }
    if (searchKeyword) {
      query += `&keyword=${searchKeyword}`;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      const res = await callFetchAllProcut(query);
      if (res && res.data) {
        setProductData(res.data.results);
        setTotal(res.data.meta.totalElements);
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [currentPage, sortQuery, filter, searchKeyword]);

  const tabItems = [
    { key: "sold,desc", label: "Phổ biến" },
    { key: "updatedAt,desc", label: "Hàng mới" },
    { key: "price,asc", label: "Giá thấp đến cao" },
    { key: "price,desc", label: "Giá cao đến thấp" },
  ];

  const handleChangeFilter = (changedValues, values) => {
    console.log("changedValues.category", changedValues.category);
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        //reset data -> fetch all
        setFilter("");
      }
    }
  };

  const onFinish = (values) => {
    if (values?.price?.from >= 0 && values?.price?.to >= 0) {
      let f = `from=${values?.price?.from}&to=${values?.price?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }

      // if(values?.category?.length){
      //   f+=`&`
      // }
      setFilter(f);
    }
  };
  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };
  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (product) => {
    const slug = convertSlug(product.name);
    navigate(`/product/${slug}?id=${product.id}`);
  };
  return (
    <>
      {productData?.length === 0 ? (
        <h1>Ko co sp</h1>
      ) : (
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
                      onClick={() => {
                        form.resetFields();
                        setFilter("");
                      }}
                    />
                  </div>
                  <Divider />

                  <Form
                    form={form}
                    onFinish={onFinish}
                    onValuesChange={(changedValues, values) =>
                      handleChangeFilter(changedValues, values)
                    }
                    layout="vertical"
                  >
                    <Form.Item name="category" label="Danh mục sản phẩm">
                      <Checkbox.Group className="custom-checkbox-group">
                        <Row style={{ marginBottom: 8 }}>
                          {categoryData.map((i) => (
                            <Col
                              key={i.id}
                              span={24}
                              style={{ padding: "6px" }}
                            >
                              <Checkbox value={i.name}>{i.name}</Checkbox>
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
                        onClick={() => form.submit()}
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
                <Spin size="large" spinning={isLoading}>
                  <div className="product-content-area">
                    <div className="sorting-tabs">
                      <Tabs
                        defaultActiveKey="1"
                        items={tabItems}
                        onChange={(key) => setSortQuery(key)}
                      />
                    </div>

                    <Row gutter={[16, 16]}>
                      {productData.map((p) => (
                        <Col
                          key={p.id}
                          xs={12}
                          sm={8}
                          md={8}
                          lg={6}
                          key={p.id}
                          onClick={() => {
                            handleRedirectBook(p);
                          }}
                        >
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
                </Spin>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
