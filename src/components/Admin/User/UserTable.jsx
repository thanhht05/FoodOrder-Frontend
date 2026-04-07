import {
  Button,
  Col,
  Flex,
  message,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import FormSearch from "./FormSearch";
import { useEffect, useState } from "react";
import { callDeleteUser, callFetchAllUser } from "../../../services/api";
import UserViewDetail from "./UserViewDetail";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import UserModalCreate from "./UserModalCreate";
import UserModalUpdate from "./UserModalUpdate";
import UserImport from "./UserImport";
import dayjs from "dayjs";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const [total, setTotal] = useState(0);

  const [sortQuery, setSortQuery] = useState("");

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [userDataDetail, setUserDataDetail] = useState(null);

  const [openModalCreateUser, setOpenModalCreateUser] = useState(false);

  const [openModalUpdateUser, setOpenModalUpdateUser] = useState(false);
  const [userDataUpdate, setUserDataUpdate] = useState(null);

  const [openModalUpload, setOpenMOdalUpload] = useState(false);
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    console.log("Sorteer", sorter.field);
    if (pagination && pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field},asc`
          : `sort=${sorter.field},desc`;

      setSortQuery(q);
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `page=${currentPage}&size=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
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
  }, [currentPage, pageSize, filter, sortQuery]);
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
      sorter: true,
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
      title: "Updated day",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,

      render: (updatedAt) =>
        dayjs(updatedAt).isValid()
          ? dayjs(updatedAt).format("DD/MM/YYYY HH:mm")
          : "User chưa được cập nhật",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                setOpenModalUpdateUser(true);
                setUserDataUpdate(record);
              }}
            >
              Update
            </a>
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ marginLeft: "8px" }}>Delete</a>
            </Popconfirm>
          </>
        );
      },
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

          <Button
            onClick={() => setOpenMOdalUpload(true)}
            icon={<CloudUploadOutlined />}
            type="primary"
          >
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
  const handleDeleteUser = async (userID) => {
    const res = await callDeleteUser(userID);
    if (res && res.data) {
      message.success("Xóa user thành công");
      fetchUser();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
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

      <UserModalUpdate
        setOpenModalUpdateUser={setOpenModalUpdateUser}
        openModalUpdateUser={openModalUpdateUser}
        setUserDataUpdate={setUserDataUpdate}
        userDataUpdate={userDataUpdate}
        fetchUser={fetchUser}
      />

      <UserImport
        openModalUpload={openModalUpload}
        setOpenModalUpload={setOpenMOdalUpload}
        fetchUser={fetchUser}
      />
    </>
  );
};
export default UserTable;
