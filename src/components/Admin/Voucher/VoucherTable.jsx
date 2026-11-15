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
import { useTranslation } from "../../../i18n";

const VoucherTable = () => {
  const { t } = useTranslation();
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
      message.success(t("admin.voucher.deleteSuccess"));
      fetchVoucher();
    } else {
      notification.error({
        message: t("common.errorOccurred"),
        description: res.message,
      });
    }
  };

  const handleToggleVoucher = async (checked, record) => {
    const status = checked ? "ACTIVE" : "INACTIVE";
    const res = await callUpdateVoucherStatus(record.id, status);

    if (res && res.data) {
      message.success(checked ? t("admin.voucher.toggleActiveSuccess") : t("admin.voucher.toggleInactiveSuccess"));
      fetchVoucher();
    } else {
      message.error(t("common.errorOccurred"));
    }
  };

  const columns = [
    {
      title: t("admin.voucher.colId"),
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
      title: t("admin.voucher.colCode"),
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: t("admin.voucher.colPercentDiscount"),
      dataIndex: "percentDiscount",
      key: "percentDiscount",
      render: (val) => `${val}%`
    },
    {
      title: t("admin.voucher.colMaxDiscount"),
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (val) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}`
    },
    {
      title: t("admin.voucher.colUsageLimit"),
      dataIndex: "usageLimit",
      key: "usageLimit",
    },
    {
      title: t("admin.voucher.colExpiration"),
      dataIndex: "expiration",
      key: "expiration",
      render: (expiration) =>
        dayjs(expiration).isValid()
          ? dayjs(expiration).format("DD/MM/YYYY")
          : t("admin.voucher.noExpiration"),
    },
    {
      title: t("admin.voucher.colStatus"),
      key: "status",
      render: (_, record) => {
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
      title: t("admin.voucher.colActions"),
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
              {t("common.update")}
            </a>
            <Popconfirm
              title={t("admin.voucher.deleteTitle")}
              description={t("admin.voucher.deleteConfirmDesc")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("common.yes")}
              cancelText={t("common.no")}
            >
              <a style={{ marginLeft: "8px" }}>{t("common.delete")}</a>
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
        <span>{t("admin.voucher.tableTitle")}</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            {t("common.addNew")}
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
