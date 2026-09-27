import {
  Button,
  Col,
  message,
  notification,
  Popconfirm,
  Row,
  Switch,
  Table,
} from "antd";
import FormSearch from "./FormSearch";
import { useEffect, useState } from "react";
import { callDeleteVoucher, callFetchAllVouchers, callUpdateVoucher, callUpdateVoucherStatus } from "../../../services/api";
import { PlusOutlined } from "@ant-design/icons";
import VoucherModalCreate from "./VoucherModalCreate";
import VoucherModalUpdate from "./VoucherModalUpdate";
import VoucherViewDetail from "./VoucherViewDetail";
import dayjs from "dayjs";

const VoucherTable = () => {
  const [listVoucher, setListVoucher] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);

  const handlePaginationChange = (pagination, filters, sorter, extra) => {
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

  const fetchVoucher = async () => {
    setIsLoading(true);
    let query = `?page=${currentPage}&size=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchAllVouchers(query);
    if (res && res.data) {
      setListVoucher(res.data.results);
      setTotal(res.data.meta.totalElements);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVoucher();
  }, [currentPage, pageSize, filter, sortQuery]);

  const handleDelete = async (id) => {
    const res = await callDeleteVoucher(id);
    if (res && res.data) {
      message.success("Xóa voucher thành công");
      fetchVoucher();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleToggleVoucher = async (checked, record) => {
    const status = checked ? "ACTIVE" : "INACTIVE";
    const res = await callUpdateVoucherStatus(record.id, status);

    if (res && res.data) {
      message.success(checked ? "Đã bật voucher" : "Đã tắt voucher");
      fetchVoucher();
    } else {
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <a
          onClick={() => {
            setOpenViewDetail(true);
            setDataDetail(record);
          }}
        >
          {record.id}
        </a>
      ),
    },
    {
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "percentDiscount",
      key: "percentDiscount",
      render: (val) => `${val}%`
    },
    {
      title: "Giảm tối đa",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (val) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}`
    },
    {
      title: "Lượt dùng",
      dataIndex: "usageLimit",
      key: "usageLimit",
    },
    {
      title: "Hết hạn",
      dataIndex: "expiration",
      key: "expiration",
      render: (expiration) =>
        dayjs(expiration).isValid()
          ? dayjs(expiration).format("DD/MM/YYYY")
          : "Không có thời hạn",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        // Assume status field is "ACTIVE" or "INACTIVE"
        const isActive = record.status === "ACTIVE";
        return (
          <Switch
            checked={isActive}
            onChange={(checked) => handleToggleVoucher(checked, record)}
          />
        );
      }
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(record);
              }}
            >
              Cập nhật
            </a>
            <Popconfirm
              title="Xóa voucher"
              description="Bạn có chắc chắn muốn xóa voucher này không?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <a style={{ marginLeft: "8px" }}>Xóa</a>
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
        <span>Danh sách voucher</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
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
            dataSource={listVoucher}
            onChange={handlePaginationChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
            }}
          />
        </Col>
      </Row>

      <VoucherModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchVoucher={fetchVoucher}
      />

      <VoucherModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchVoucher={fetchVoucher}
      />

      <VoucherViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
    </>
  );
};
export default VoucherTable;
