import { Button, Col, Flex, Row, Space, Table, Tag } from "antd";
import FormSearch from "./FormSearch";
import { useEffect, useState } from "react";
import { callFetchAllUser } from "../../../services/api";
import UserViewDetail from "./UserViewDetail";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import UserModalCreate from "./UserModalCreate";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const [total, setTotal] = useState(0);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [userDataDetail, setUserDataDetail] = useState(null);

  const [openModalCreateUser, setOpenModalCreateUser] = useState(false);
  const handlePaginationChange = (pagination) => {
    if (pagination && pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `page=${currentPage}&size=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    const res = await callFetchAllUser(query);
    if (res && res.data) {
      setListUser(res.data.results);
      setTotal(res.data.meta.totalElements);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchUser();
  }, [currentPage, pageSize, filter]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "naidme",
      render: (_, record) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setUserDataDetail(record);
          }}
        >
          {record.id}
        </a>
      ),
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

  const handleSearch = (query) => {
    setFilter(query);
  };
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Table List Users</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button icon={<ExportOutlined />} type="primary">
            Export
          </Button>

          <Button icon={<CloudUploadOutlined />} type="primary">
            Import
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreateUser(true)}
          >
            Thêm mới
          </Button>
        </span>
      </div>
    );
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <FormSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            rowKey="id"
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

      <UserViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        userDataDetail={userDataDetail}
        setUserDataDetail={setUserDataDetail}
      />

      <UserModalCreate
        openModalCreateUser={openModalCreateUser}
        setOpenModalCreateUser={setOpenModalCreateUser}
        fetchUser={fetchUser}
      />
    </>
  );
};
export default UserTable;
