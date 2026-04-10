import { Button, Col, Form, Input, Row, theme } from "antd";

const FormSearch = ({ handleSearch, setFilter }) => {
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
      query += `&keyword=${values.keyword.trim()}`;
    }
    if (values.category) {
      query += `&category=${values.category.trim()}`;
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
          <Form.Item labelCol={{ span: 24 }} name={`keyword`} label={`Keyword`}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`category`}
            label={`Category`}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`price`} label={`Price`}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              setFilter("");
            }}
          >
            Clear
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
