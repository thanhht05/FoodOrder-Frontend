import { Col, Flex, Row, Space, Table, Tag } from "antd";
import FormSearch from "./FormSearch";
import { useEffect, useState } from "react";
import { callFetchAllUser } from "../../../services/api";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [total, setTotal] = useState(0);

  const handlePaginationChange = (pagination) => {
    if (pagination && pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await callFetchAllUser(currentPage, pageSize);
      if (res && res.data) {
        setListUser(res.data.results);
        setTotal(res.data.meta.totalElements);
      }
    };
    fetchUser();
  }, [currentPage, pageSize]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "naidme",
      render: (id) => <a>{id}</a>,
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="medium">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <FormSearch />
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={listUser}
            onChange={handlePaginationChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
            }}
          />
          ;
        </Col>
      </Row>
    </>
  );
};
export default UserTable;
