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
import {
  callDeleteUser,
  callFetchAllUser,
  callFetchTable,
} from "../../../services/api";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const TableList = () => {
  const [listTable, setListTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  //   const [openViewDetail, setOpenViewDetail] = useState(false);
  //   const [userDataDetail, setUserDataDetail] = useState(null);

  //   const [openModalCreateUser, setOpenModalCreateUser] = useState(false);

  //   const [openModalUpdateUser, setOpenModalUpdateUser] = useState(false);
  //   const [userDataUpdate, setUserDataUpdate] = useState(null);

  //   const [openModalUpload, setOpenMOdalUpload] = useState(false);
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    debugger;
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

  const fetchTable = async () => {
    setIsLoading(true);
    let query = `page=${currentPage}&size=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }
    const res = await callFetchTable(query);
    if (res && res.data) {
      setListTable(res.data.results);
      setTotal(res.data.meta.totalElements);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTable();
  }, [currentPage, filter, pageSize]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "naidme",
      render: (_, record) => (
        <a
        //   onClick={() => {
        //     setOpenViewDetail(true);
        //     setUserDataDetail(record);
        //   }}
        >
          {record.id}
        </a>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "tableStatus",
      key: "tableStatus",
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
    console.log("query", query);
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
      fetchTable();
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
            dataSource={listTable}
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
export default TableList;
