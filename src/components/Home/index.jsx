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
  Drawer,
  Empty,
  Tag,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  ThunderboltFilled,
  SafetyCertificateFilled,
  FireFilled,
} from "@ant-design/icons";
import { callFetchAllCategory, callFetchAllProcut } from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";

const { Text, Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 8;
  const [sortQuery, setSortQuery] = useState("sold,desc");
  const [filter, setFilter] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

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
      try {
        const res = await callFetchAllProcut(query);
        if (res && res.data) {
          setProductData(res.data.results);
          setTotal(res.data.meta.totalElements);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [currentPage, sortQuery, filter, searchKeyword]);

  const tabItems = [
    { key: "sold,desc", label: t("home.sortPopular") },
    { key: "updatedAt,desc", label: t("home.sortNew") },
    { key: "price,asc", label: t("home.sortPriceAsc") },
    { key: "price,desc", label: t("home.sortPriceDesc") },
  ];

  const handleChangeFilter = (changedValues, values) => {
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
      setCurrentPage(1);
    }
  };

  const onFinish = (values) => {
    if (values?.price?.from >= 0 && values?.price?.to >= 0) {
      let f = `from=${values?.price?.from}&to=${values?.price?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
      setCurrentPage(1);
      setOpenDrawer(false);
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
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();

    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleRedirectBook = (product) => {
    const slug = convertSlug(product.name);
    navigate(`/product/${slug}?id=${product.id}`);
  };

  const FilterContent = (
    <div className="filter-sidebar">
      <div className="filter-header">
        <span className="filter-header-left">
          <FilterOutlined className="icon-brand" />
          <span className="filter-title">{t("home.filterTitle")}</span>
        </span>
        <ReloadOutlined
          className="reset-btn"
          title={t("common.reset")}
          onClick={() => {
            form.resetFields();
            setFilter("");
            setCurrentPage(1);
          }}
        />
      </div>
      <Divider style={{ margin: "14px 0" }} />

      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={(changedValues, values) =>
          handleChangeFilter(changedValues, values)
        }
        layout="vertical"
      >
        <Form.Item name="category" label={t("home.foodCategory")}>
          <Checkbox.Group className="custom-checkbox-group">
            <Row gutter={[0, 8]}>
              {categoryData.map((i) => (
                <Col key={i.id} span={24}>
                  <Checkbox value={i.name} className="category-checkbox-item">
                    {i.name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Divider style={{ margin: "14px 0" }} />

        <Form.Item label={t("home.priceRange")} style={{ marginBottom: 0 }}>
          <div className="price-range-inputs">
            <Form.Item name={["price", "from"]} noStyle>
              <InputNumber
                min={0}
                placeholder={t("home.priceFrom")}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <span className="separator">—</span>
            <Form.Item name={["price", "to"]} noStyle>
              <InputNumber
                min={0}
                placeholder={t("home.priceTo")}
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
            {t("home.applyFilter")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const visibleProducts = productData.filter((p) => p.quantity > 0);

  return (
    <div className="home-container">
      <div className="container-layout">
        {/* Hero Banner */}
        <div className="storefront-hero">
          <div className="hero-content">
            <div className="hero-badges">
              <span className="hero-pill">
                <FireFilled /> {t("footer.todayMenu")}
              </span>
              <span className="hero-pill secondary">
                <ThunderboltFilled /> {t("product.fastDelivery")}
              </span>
              <span className="hero-pill secondary hide-xs">
                <SafetyCertificateFilled /> {t("product.qualityGuarantee")}
              </span>
            </div>
            <Title level={1} className="hero-title">
              {t("auth.loginHeroTitle")}
            </Title>
            <Paragraph className="hero-subtitle">
              {t("auth.loginHeroDesc")}
            </Paragraph>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Sidebar Filter - Desktop only */}
          <Col xs={0} lg={6} xl={5}>
            {FilterContent}
          </Col>

          {/* Product Listing Area */}
          <Col xs={24} lg={18} xl={19}>
            <div className="product-content-area">
              <div className="toolbar-row">
                <div className="mobile-filter-container">
                  <Button
                    className="mobile-filter-btn"
                    icon={<FilterOutlined />}
                    onClick={() => setOpenDrawer(true)}
                  >
                    {t("home.filterDrawerTitle")}
                  </Button>
                </div>

                <div className="sorting-tabs">
                  <Tabs
                    activeKey={sortQuery}
                    items={tabItems}
                    onChange={(key) => {
                      setSortQuery(key);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {isLoading ? (
                <Row gutter={[18, 18]}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Col xs={12} sm={8} md={8} xl={6} key={i}>
                      <Card loading={true} className="skeleton-card" />
                    </Col>
                  ))}
                </Row>
              ) : visibleProducts.length === 0 ? (
                <div className="empty-products-box">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t("common.notAvailable")}
                  />
                </div>
              ) : (
                <Spin size="large" spinning={isLoading}>
                  <Row gutter={[18, 18]}>
                    {visibleProducts.map((p) => (
                      <Col
                        key={p.id}
                        xs={12}
                        sm={8}
                        md={8}
                        xl={6}
                        onClick={() => handleRedirectBook(p)}
                      >
                        <Card
                          hoverable
                          bordered={false}
                          className="product-card premium-card"
                          cover={
                            <div className="image-wrapper">
                              {p.productCate?.name && (
                                <Tag className="category-badge">
                                  {p.productCate.name}
                                </Tag>
                              )}
                              <img
                                alt={p.name}
                                src={p.lstImg?.[0]?.name}
                                loading="lazy"
                              />
                            </div>
                          }
                        >
                          <div className="product-info">
                            <div className="product-name-wrapper">
                              <Text title={p.name} className="product-name">
                                {p.name}
                              </Text>
                            </div>

                            <div className="product-price-row">
                              <span className="product-price">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(p.price)}
                              </span>
                              <span className="quick-cart-icon">
                                <ShoppingCartOutlined />
                              </span>
                            </div>

                            <div className="product-footer">
                              <Rate
                                disabled
                                defaultValue={5}
                                className="card-rate"
                              />
                              <Text type="secondary" className="sold-count">
                                {t("home.soldCount", {
                                  count: p.sold ?? "1.2k",
                                })}
                              </Text>
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
                </Spin>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <Drawer
        title={t("home.filterTitle")}
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width={300}
        className="mobile-filter-drawer"
      >
        {FilterContent}
      </Drawer>
    </div>
  );
};

export default Home;
