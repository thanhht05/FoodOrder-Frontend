import { Button, Col, Form, Input, Row, theme } from "antd";
import { useTranslation } from "../../../i18n";

const FormSearch = ({ handleSearch, setFilter }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    // build Query
    if (values.fullName) {
      query += `&fullName=${values.fullName.trim()}`;
    }
    if (values.email) {
      query += `&email=${values.email.trim()}`;
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
          <Form.Item labelCol={{ span: 24 }} name={`fullName`} label={t("admin.user.searchFullNameLabel")}>
            <Input placeholder={t("admin.user.searchFullNamePlaceholder")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`email`} label={t("admin.user.searchEmailLabel")}>
            <Input placeholder={t("admin.user.searchEmailPlaceholder")} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`phone`}
            label={t("admin.user.searchPhoneLabel")}
          >
            <Input placeholder={t("admin.user.searchPhonePlaceholder")} />
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
          {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
        </Col>
      </Row>
    </Form>
  );
};
export default FormSearch;
