import { Button, Col, Form, Input, Row, theme } from "antd";
import { useTranslation } from "../../../i18n";

const FormSearch = ({ handleSearch, setFilter }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    if (values.keyword) {
      query += `&keyword=${encodeURIComponent(values.keyword.trim())}`;
    }
    if (values.category) {
      query += `&category=${encodeURIComponent(values.category.trim())}`;
    }

    handleSearch(query);
  };
  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`keyword`} label={t("admin.product.keywordLabel")}>
            <Input placeholder={t("admin.product.searchNamePlaceholder")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`category`}
            label={t("admin.product.searchCategoryLabel")}
          >
            <Input placeholder={t("admin.product.searchCategoryPlaceholder")} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`price`} label={t("admin.product.colPrice")}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            {t("common.search")}
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              setFilter("");
            }}
          >
            {t("common.reset")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default FormSearch;
