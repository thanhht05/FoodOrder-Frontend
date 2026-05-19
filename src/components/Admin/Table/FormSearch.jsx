import { Button, Col, Form, Input, Row, Select, theme } from "antd";

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
    console.log("value", values);
    let query = "";
    // build Query
    if (values.tableName) {
      query += `&keyword=${values.tableName.trim()}`;
    }
    if (values.tableStatus) {
      query += `&status=${values.tableStatus.trim()}`;
    }
    console.log("query", query);
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
          <Form.Item
            labelCol={{ span: 24 }}
            name={`tableName`}
            label={`Số bàn`}
          >
            <Input placeholder="Nhập số bàn cần tìm" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="tableStatus" label="Status" labelCol={{ span: 24 }}>
            <Select
              showSearch={{
                optionFilterProp: ["label", "otherField"],
              }}
              placeholder="Tìm kiếm bàn theo trạng thái"
              options={[
                { value: "AVAILABLE", label: "Còn trống" },
                { value: "RESERVED", label: "Đã đạt trước" },
                { value: "OCCUPIED", label: "Bận" },
                { value: "disabled", label: "Disabled", disabled: true },
              ]}
            />
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
