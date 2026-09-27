import { Button, Col, Form, Input, Row, theme } from "antd";

const FormSearch = (props) => {
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
    if (values.code) {
      query += `&code=${values.code}`;
    }
    if (query) {
      props.handleSearch(query);
    }
  };

  const onReset = () => {
    form.resetFields();
    props.setFilter("");
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name={`code`}
            label={`Mã Voucher`}
          >
            <Input placeholder="Nhập mã voucher" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              onReset();
            }}
          >
            Làm mới
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormSearch;
