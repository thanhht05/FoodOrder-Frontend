import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { callFetchAllProcut } from "../../../services/api";
import FormSearch from "./FormSearch";
import ProductViewDetail from "./ProductViewDetail";

const ProductTable = () => {
  const [openProductViewDetail, setOpenProductViewDetail] = useState(false);
  const [productDataDetail, setProductDataDetail] = useState(null);

  const [listProcut, setlistProcut] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  const fetchProduct = async (query) => {
    setIsLoading(true);
    const res = await callFetchAllProcut(query);
    if (res && res.data) {
      setlistProcut(res.data.results);
      setTotal(res.data.meta.totalElements);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    let query = `page=${currentPage}&size=${pageSize}`;
    if (filter) {
      query += filter;
    }
    if (sortQuery) {
      query += sortQuery;
    }
    fetchProduct(query);
  }, [currentPage, filter, sortQuery]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "naidme",
      render: (_, record) => (
        <a
          onClick={() => {
            (setOpenProductViewDetail(true), setProductDataDetail(record));
          }}
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
      sorter: true,
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
            <a>Update</a>
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              //   onConfirm={() => handleDeleteUser(record.id)}
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

  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `&sort=${sorter.field},asc`
          : `&sort=${sorter.field},desc`;
      setSortQuery(q);
    }
  };
  const handleSearch = (query) => {
    setFilter(query);
  };

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Table List Products</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button icon={<ExportOutlined />} type="primary">
            Export
          </Button>

          <Button
            // onClick={() => setOpenMOdalUpload(true)}
            icon={<CloudUploadOutlined />}
            type="primary"
          >
            Import
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            // onClick={() => setOpenModalCreateUser(true)}
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
            dataSource={listProcut}
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

      <ProductViewDetail
        openProductViewDetail={openProductViewDetail}
        setOpenProductViewDetail={setOpenProductViewDetail}
        productDataDetail={productDataDetail}
        setProductDataDetail={setProductDataDetail}
      />
    </>
  );
};
export default ProductTable;
