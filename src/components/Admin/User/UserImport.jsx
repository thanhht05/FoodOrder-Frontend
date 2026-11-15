import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, notification, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../services/api";
import { useTranslation } from "../../../i18n";

const UserImport = ({ openModalUpload, setOpenModalUpload, fetchUser }) => {
  const [dataExcel, setDataExcel] = useState([]);
  const { t } = useTranslation();

  const handleOk = async () => {
    // add password for user
    const data = dataExcel.map((item) => ({
      ...item,
      password: "123456",
      role: {
        id: 1,
      },
    }));

    const res = await callBulkCreateUser(data);

    if (res && res.data) {
      const { success, failed, total } = res.data;

      if (success.length === total) {
        message.success(t("admin.user.importAllSuccess", { total }));
        setDataExcel([]);
        await fetchUser();
        setOpenModalUpload(false);
      } else if (success.length > 0) {
        notification.warning({
          message: t("admin.user.importPartialTitle"),
          description: (
            <>
              <div>{t("admin.user.importSuccessCount", { count: success.length })}</div>
              <div>{t("admin.user.importFailedCount", { count: failed.length })}</div>
              <div>{t("admin.user.importFailedEmails", { emails: failed.map((f) => f.email).join(", ") })}</div>
            </>
          ),
          duration: 5,
        });
        setDataExcel([]);
        await fetchUser();
        setOpenModalUpload(false);
      } else {
        notification.error({
          message: t("admin.user.importFailedTitle"),
          description: (
            <>
              <div>{t("common.errorTitle")}</div>
              <div>{failed.map((f) => f.email).join(", ")}</div>
            </>
          ),
          duration: 5,
        });
        setDataExcel([]);
        setOpenModalUpload(false);
      }
    }

    setOpenModalUpload(false);
  };
  const handleCancel = () => {
    setOpenModalUpload(false);
    setDataExcel([]);
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const propsUserUpload = {
    name: "file",
    multiple: true,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    customRequest: dummyRequest,

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1, //skip header row
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }
        message.success(t("admin.user.fileUploadSuccess", { name: info.file.name }));
      } else if (status === "error") {
        message.error(t("admin.user.fileUploadFailed", { name: info.file.name }));
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const columns = [
    {
      title: t("admin.user.colFullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("admin.user.colEmail"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("admin.user.colPhone"),
      dataIndex: "phone",
      key: "phone",
    },
  ];
  return (
    <>
      <Modal
        title={t("admin.user.importModalTitle")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpload}
        onOk={handleOk}
        okText={t("admin.user.importOkText")}
        cancelText={t("common.cancel")}
        onCancel={handleCancel}
      >
        <Dragger {...propsUserUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {t("admin.user.importDragText")}
          </p>
          <p className="ant-upload-hint">
            {t("admin.user.importHintText")}
          </p>
        </Dragger>

        <>
          <Table
            title={() => <span>{t("admin.user.importTableTitle")}</span>}
            dataSource={dataExcel}
            columns={columns}
          />
          ;
        </>
      </Modal>
    </>
  );
};

export default UserImport;
